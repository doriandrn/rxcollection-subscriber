import { RxCollection, RxDocument } from 'rxdb'
import { action, observable, computed, reaction, toJS } from 'mobx'
import delay from './helpers/delay';

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
  lazy ?: boolean
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
 * @implements {LodgerSubscriber}
 */
export default class Subscriber<N extends string> implements RxSubscriber {
  private documents: RxDocument<N>[] = [] // main data holder, reactive by itself

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

  @computed get selected () { return this.selectedId }
  @computed get active () { return this.activeId }

  @computed get ids () { return Object.keys(this.items) }

  @computed get items () {
    return Object.assign({},
      ...this.documents
        .map(item => ({ [item._id]: item._data }))
    )
  }

  @computed get selectedDoc () {
    return this.documents.filter(doc => doc._id === this.selectedId)[0]
  }

  @computed get editing () {
    return this.documents.filter(doc => doc._id === this.activeId)[0]
  }

  @computed get length () {
    return this.ids.length
  }

  kill : () => void = () => {}

  /**
   * Creates an instance of Subscriber.
   *
   * @param {string} name - eg. 'registru'
   * @param {Taxonomy} taxonomy
   * @param {Criteriu} criteriu - initial sort / filter criteria if it shall not use the default one
   * @memberof Subscriber
   */
  constructor (
    protected collection: RxCollection<N>,
    readonly options ?: SubscriberOptions
  ) {
    // Register the reaction on criteria change
    reaction(() => ({ ...this.criteria }), (newC) => {
      this.kill = this.subscribe(toJS(newC))
    }, { fireImmediately: true })

    if (options) {
      if (options.multipleSelect) {
        this.selectedId = []
      }
    }
  }

  /**
   * Observables changes wwhenever data changes
   *
   * @private
   * @param {RxDocument<any>[]} changes
   * @memberof Subscriber
   */
  @action private handleSubscriptionData (changes: RxDocument<any>[]) {
    if (!this.subscribed) this.subscribed = true

    this.documents = changes

    // defer this a little bit for user friendliness &/or transitions
    setTimeout(() => { this.fetching = false }, 100)
  }

  @action private subscribeRequested () {
    this.fetching = true
  }

  /**
   * (re)Subscribes with given Criteria
   * happens internaly when criteriu is changed
   *
   * @param {Criteriu} [criteriu]
   * @memberof Subscriber
   */
  subscribe (
    { limit, index, sort, filter }: Criteria
  ) {
    this.subscribeRequested()
    const { options } = this
    limit = Number(limit)
    index = Number(index)

    const paging = options && options.progressivePaging ?
      (limit + limit * index) :
      limit

    const { unsubscribe } = this.collection
      .find(filter)
      .limit(paging)
      .sort(toJS(sort))
      .$
      .subscribe(changes => this.handleSubscriptionData(changes))

    return unsubscribe
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
          await delay(50) // quite hacky, waits for @computeds to effect
          resolve()
        }
      }))
    })
  }
}
