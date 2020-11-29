import { RxCollection, RxDocument, RxQuery } from 'rxdb'
import { action, observable, computed, reaction, toJS } from 'mobx'
import { SubjectSubscriber } from 'rxjs/internal/Subject'

/**
 * Single RXCollection subscriber interface
 *
 * @interface RxSubscriber
 */
interface RxSubscriber {
  readonly criteria: Criteria

  select (id: string): RxDocument<any>
  edit (id: string): RxDocument<any>
  render (opts: RenderOptions): void

  subscribe (criteria ?: Criteria): Function // Subscription
  kill (): void
}

type SubscriberOptions = {
  name ?: string,
  lazy ?: boolean,
  criteria ?: Criteria,
  progressivePaging ?: boolean
  multipleSelect ?: boolean
  autoSelectOnCRUD ?: boolean // whenever an items is added / updated -> it's id gets selected
  fields ?: string[],
  context ?: string,
  holder ?: Subscriber<any>[]
}

export type Criteria = {
  limit ?: number
  index ?: number
  sort ?: { [key: string]: number }
  filter ?: { [key: string]: any }
}

/**
 * Creates a new data sucker for any RxCollection
 * refreshes data on criteria changes
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

  @observable selectedId : string | string[] = ''
  @observable activeId ?: string

  @computed get ids () { return Object.keys(this.items) }

  @computed get items () {
    const { fields } = this
    return Object.assign({},
      ...this.documents
        .map(_doc => ({ [_doc[this.primaryPath]]: Object.assign({}, fields && fields !== 'all' ?
            Object.fromEntries(fields.map(f => [f, _doc[f]])) :
            _doc._data, { _doc }
        )}))
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

  name: string = 'unnamed'
  context: string = 'main'
  readonly fields: string[] | 'all' = 'all'
  query ?: RxQuery
  _sub ?: SubjectSubscriber

  protected get primaryPath () {
    return this.collection.schema.primaryPath || '_id'
  }

  // render : (opts : RenderOptions) => void = () => {}
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
    this.kill = () => {}

    if (options) {
      const { multipleSelect, lazy, criteria, fields, name, context, autoSelectOnCRUD } = options

      if (multipleSelect)
        this.selectedId = []

      if (lazy)
        fireImmediately = false

      if (criteria)  {
        Object.keys(criteria).forEach(key => this.criteria[key] = criteria[key])
      }

      if (fields) {
        this.fields = fields
      }

      if (name) {
        this.name = name
      }

      if (context)
        this.context = context

      // if (autoSelectOnCRUD) {
      //   collection.postInsert((data, doc) => {
      //     this.select(doc._id)
      //   }, false)
      // }
    }

    // Register the reaction on criteria change
    reaction(() => ({ ...this.criteria }), () => {
      this.query = this.collection
        .find({ selector: this.filter || {} })
        .limit(this.paging)
        .sort(toJS(this.criteria.sort))

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
  protected subscribe () {
    if (!this.query) return
    this.fetching = true

    // Unsubscribe from previous query
    if (this._sub)
      this._sub.unsubscribe()

    this._sub = this.query.$.subscribe(docs => {
      this.documents = docs
      this.fetching = false
      if (!this.subscribed) this.subscribed = true
    })

    return this._sub.unsubscribe.bind(this._sub)
  }

  /**
   * (De)selects an item by it's id
   *
   * @param {string} id
   * @memberof Subscriber
   */
  @action select (id: string | string[]) {
    if (typeof this.selectedId !== 'string' &&
      this.selectedId &&
      this.options &&
      this.options.multipleSelect
    ) {
      const select = (id: string | string[]) => {
        if (typeof id === 'string') {
          if (this.selectedId.indexOf(id) < 0)
            this.selectedId.push(id)
          else
            this.selectedId.splice(this.selectedId.indexOf(id), 1)
        } else {
          if (id.length) id.map(_id => select(_id))
        }
      }

      select(id)
    } else {
      this.selectedId = id !== String(this.selectedId) ? id : '')
    }

    // refsIds(this.context)
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
          await this.collection.database.requestIdlePromise()
          resolve()
        }
      }))
    })
  }
}
