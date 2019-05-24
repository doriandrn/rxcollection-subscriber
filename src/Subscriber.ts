import { RxCollection, RxDocument } from 'rxdb'
import { action, observable, computed, reaction, toJS } from 'mobx'

const delay = function (value: number) {
  return new Promise(resolve =>
    setTimeout(() => resolve(), value)
  )
}

/**
 * Single RXCollection subscriber interface
 *
 * @interface RxSubscriber
 */
interface RxSubscriber {
  readonly criteria: Criteria

  select (id: string): RxDocument<any>
  edit (id: string): RxDocument<any>

  subscribe (criteria ?: Criteria): Function // Subscription
  kill (): void
}

type SubscriberOptions = {
  lazy ?: boolean,
  criteria ?: Criteria,
  progressivePaging ?: boolean
  multipleSelect ?: boolean
  autoSelectOnCRUD ?: boolean // whenever an items is added / updated -> it's id gets selected
}

export type Criteria = {
  limit ?: number
  index ?: number
  sort ?: { [key: string]: number }
  filter ?: { [key: string]: any }
}

/**
 * Creates a new data sucker for any RxCollection
 * refreshes data on criteria change
 *
 * @class Subscriber
 * @implements {RxSubscriber}
 */
export default class Subscriber<N extends string> implements RxSubscriber {
  @observable private documents: RxDocument<N>[] = []

  @observable criteria: Criteria = {
    limit: 25,
    index: 0,
    sort: {},
    filter: undefined
  }

  @observable fetching: Boolean = false

  @observable subscribed: Boolean = false

  @observable selectedId ?: string | string[]
  @observable activeId ?: string

  @computed get ids () { return Object.keys(this.items) }

  @computed get items () {
    return Object.assign({},
      ...this.documents
        .map(item => ({ [item[this.primaryPath]]: item._data }))
    )
  }

  @computed get selectedDoc () {
    return this.documents.filter(doc => doc[this.primaryPath] === this.selectedId)[0]
  }

  @computed get editing () {
    return this.documents.filter(doc => doc[this.primaryPath] === this.activeId)[0]
  }

  @computed get length () {
    return this.ids.length
  }

  protected get primaryPath () {
    return this.collection.schema.primaryPath || '_id'
  }

  kill : () => void = () => {}

  /**
   * Creates an instance of Subscriber.
   *
   * @param {string} name
   * @param {RxCollection} collection
   * @param {SubscriberOptions} options
   *
   * @memberof Subscriber
   */
  constructor (
    protected collection: RxCollection<N>,
    readonly options ?: SubscriberOptions
  ) {
    let fireImmediately: boolean = true

    if (options) {
      const { multipleSelect, lazy } = options

      if (multipleSelect)
        this.selectedId = []

      if (lazy)
        fireImmediately = false
    }

    // Register the reaction on criteria change
    reaction(() => ({ ...this.criteria }), () => {
      this.kill = this.subscribe()
    }, { fireImmediately })
  }

  @computed get filter () {
    return this.criteria.filter
  }

  @computed get paging () {
    const { options } = this
    const limit = Number(this.criteria.limit)
    const index = Number(this.criteria.index)

    return options && options.progressivePaging ?
      (limit + limit * index) :
      limit
  }

  /**
   * (re)Subscribes with given Criteria
   * happens internaly when criteria is changed
   *
   * @param {Criteriu} [criteriu]
   * @memberof Subscriber
   */
  protected async subscribe () {
    this.fetching = true

    this.documents = await this.collection
      .find(this.filter)
      .limit(this.paging)
      .sort(toJS(this.criteria.sort))
      .exec()

    this.fetching = false
  }

  /**
   * (De)selects an item by it's id
   *
   * @param {string} id
   * @memberof Subscriber
   */
  @action select (id: string) {
    if (typeof this.selectedId !== 'string' &&
      this.selectedId &&
      this.options &&
      this.options.multipleSelect
    ) {
      if (this.selectedId.indexOf(id) < 0)
        this.selectedId.push(id)
      else
        this.selectedId.splice(this.selectedId.indexOf(id), 1)
    } else {
      this.selectedId = id
    }
  }

  /**
   * Sets the active document to be furtherly edited
   *
   * @param {string} id
   * @memberof Subscriber
   */
  @action edit (id: string) {
    this.activeId = id
  }

  get updates () {
    return new Promise((resolve) => {
      reaction(() => this.fetching, (async (status) => {
        if (!status) {
          await delay(50) // quite hacky, waits for @computeds to update
          resolve()
        }
      }))
    })
  }
}
