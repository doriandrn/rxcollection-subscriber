import { RxCollection, RxDocument, RxQuery } from 'rxdb'
import { action, observable, computed, reaction, toJS } from 'mobx'

import render, { RenderOptions } from './render/es6'

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
  render (opts: RenderOptions): void

  // subscribe (criteria ?: Criteria): Function // Subscription
  // kill (): void
}

type SubscriberOptions = {
  name ?: string,
  lazy ?: boolean,
  criteria ?: Criteria,
  progressivePaging ?: boolean
  multipleSelect ?: boolean
  autoSelectOnCRUD ?: boolean // whenever an items is added / updated -> it's id gets selected
  fields ?: string[]
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

  @observable selectedId ?: string | string[]
  @observable activeId ?: string

  @computed get ids () { return Object.keys(this.items) }

  @computed get items () {
    const { fields } = this
    return Object.assign({},
      ...this.documents
        .map(_doc => ({ [_doc[this.primaryPath]]: Object.assign({}, fields ?
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

  readonly query ?: RxQuery

  name: string = 'unnamed'
  context: string = 'main'

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
    this.kill = () => {}

    if (options) {
      const { multipleSelect, lazy, criteria, fields, name, context } = options

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
    }

    // Register the reaction on criteria change
    reaction(() => ({ ...this.criteria }), () => {
      this.kill = this.subscribe()
    }, { fireImmediately })

    // if (process && process.browser) {
    this.render = render.bind(this)
    // }
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
    this.fetching = true

    this.query = this.collection
      .find({ selector: this.filter })
      .limit(this.paging)
      .sort(toJS(this.criteria.sort))
      // .exec()

    this.query.$.subscribe(docs => {
      if (!this.subscribed) this.subscribed = true
      this.documents = docs
      this.fetching = false
    })

    return this.collection.destroy.bind(this.collection)
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
