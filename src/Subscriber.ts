import { RxCollection, RxDocument, RxQuery } from 'rxdb'
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
  render (opts: RxRenderOptions): void

  // subscribe (criteria ?: Criteria): Function // Subscription
  // kill (): void
}

type SubscriberOptions = {
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

type RxRenderOptions = {
  selector:  string
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
    const { fields } = this
    return Object.assign({},
      ...this.documents
        .map(item => ({ [item[this.primaryPath]]: fields ?
            Object.fromEntries(fields.map(f => [f, item[f]])) :
            item._data
          }))
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
      const { multipleSelect, lazy, criteria, fields } = options

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
   * Implicit render function
   * Renders pure HTML
   *
   * By default, fields starting with "_" are excluded
   *
   * This function is only for the browser but it could also work
   * in console / terminal. Imagine that! An app running in the console! Dev swag at it's finest
   *
   * @param {RenderOptions} opts
   * @memberof Subscriber
   */
  render (opts: RenderOptions) {
    if (!document)
      throw new Error('Render function only works in browser so far.')

    let { selector, messages } = opts

    // Default messages object if none supplied
    messages = messages || {
      emptyState: `None`,
      multipleSelected: `%s selected`
    }

    const el = document.querySelector(selector)
    if (!el)
      throw new Error('Could not find selector', selector)


    const header = document.createElement('li')
    const controlsEl = document.createElement('div')

    const selectedControl = document.createElement('div')

    const controls = {
      limit: { type: 'number' },
      filter: { type: 'text' }
    }

    const { indexes, jsonSchema: { properties } } = this.collection.schema
    const schemaFields = Object
    .keys(properties)
    .filter(field => {
      return field.indexOf('_') !== 0
    })

    el.dataset.sub = this.collection.name
    controlsEl.classList.add('controls')
    controlsEl.append(selectedControl)

    Object.keys(controls).map(control => {
      const controlContainer = document.createElement('span')

      const label = document.createElement('label')
      label.textContent = String(control).toUpperCase()

      switch (control) {
        case 'limit':
          const input = document.createElement('input')
          input.type = controls[control].type
          input.value = this.criteria[control]
          input.addEventListener('change', e => {
            this.criteria[control] = e.target.value
          })
          controlContainer.append(input)
          break

        case 'filter':
          const but = document.createElement('button')
          but.textContent = 'add filter'

          const filterEntry = document.createElement('div')

          const connector = document.createElement('select')
          const fieldSelect = document.createElement('select')
          const operator = document.createElement('select')
          const removeFilter = document.createElement('button')
          const valInput = document.createElement('input')

          const ops = fieldType => fieldType === 'number' ?
            {
              lt: '<',
              lte: '<=',
              gt: '>',
              gte: '>=',
              eq: '='
            } :
            {
              in: 'contains',
              nin: 'does not contain',
              regex: 'RegEx',
            }

          schemaFields.map(field => {
            const op = document.createElement('option')
            op.value = field
            op.textContent = field
            fieldSelect.append(op)
          })

          removeFilter.textContent = 'Remove filter'

          const valChange = (operator, input, field) => e => {
            const { value } = e.target
            if (!value) return

            but.disabled = false

            const filterValue = { [field.value]: {
              [`$${operator.value}`]: input.type === 'number' ?
                Number(input.value) :
                String(input.value)
            }}
            console.log('fv', filterValue)
            this.criteria.filter = filterValue
          }

          fieldSelect.name = 'field'
          const fieldChange = (operator, input) => e => {
            const { value } = e.target
            const fieldType = properties[value].type
            // console.log(input, operator, value, e, fieldType)
            input.setAttribute('type', fieldType === 'number' ? 'number' : 'text')
            // input.type = fieldType === 'number' ? 'number' : 'text'
            input.value = null

            const _ops = ops(fieldType)
            console.log(_ops)

            operator.innerHTML = ''

            Object
              .keys(_ops)
              .map(opId => {
              const opEl = document.createElement('option')
              opEl.value = opId
              opEl.textContent = _ops[opId]
              operator.append(opEl)
            })
          }

          filterEntry.append(fieldSelect, operator, valInput, removeFilter)

          but.addEventListener('click', e => {
            const f = filterEntry.cloneNode(true)
            const fnext = filterEntry.cloneNode(true)
            console.log(f.children)

            f.children[0].addEventListener('change', fieldChange(f.children[1], f.children[2]))
            // f.children[1].addEventListener(opChange)
            f.children[2].addEventListener('change', valChange(f.children[1], f.children[2], f.children[0]))

            fnext.prepend(connector)

            controlContainer.append(f)
            controlContainer.append(fnext)
            e.target.disabled = true
          })
          controlContainer.append(but)
          break
      }

      controlContainer.append(label)
      controlsEl.append(controlContainer)
    })

    schemaFields.map(field => {
      const isSortable = indexes.length && indexes.filter(index => index.indexOf(field) > -1).length

      const span = document.createElement('span')
      span.textContent = field
      if (isSortable) {
        span.classList.add('sortable')
        span.addEventListener('click', () => {
          const direction = Number(!this.criteria.sort[field])
          this.criteria.sort = { [field]: direction }
          span.dataset.dir = direction
        })
      }
      header.append(span)
    })

    const itemsEl = document.createElement('ol')
    itemsEl.start = 0
    if (opts.asTable) itemsEl.classList.add('table')

    reaction(() => typeof this.selectedId === 'object' ? [ ...this.selectedId ] : this.selectedId, ids => {
      console.log('s ids', ids)
      const { selectedId } = this
      if (typeof selectedId === 'object')
        selectedControl.innerHTML = messages.multipleSelected.replace('%s', this.selectedId.length)
    })

    reaction(() => ({ ...this.items }), (async (items) => {
      console.log('REACTIN', items)
      let itemsHTML = ''

      const itemsList = Object.keys(this.items)
      el.classList.add('fetching')

      if (itemsList.length) {
        itemsList.map((itemId, index) => {
          const item = this.items[itemId]
          itemsHTML += `<li data-id="${itemId}">`
          if (index === 0) {

          }
          Object.keys(item)
            .filter(field =>  field.indexOf('_') !== 0)
            .sort((a, b) => schemaFields.indexOf(a) - schemaFields.indexOf(b))
            .map((field, i) => {
              let tag = i === 0 ? 'strong' : 'span'
              let content = item[field]
              if (typeof content === 'string' && content.indexOf('.jpg') === content.length - 4) {
                tag = 'figure'
                content = `<img src="${content}" />`
              }
              itemsHTML += `<${tag}>${content}</${tag}>` // this has to stay as minimal as this
            })
          itemsHTML += `</li>`
        })

        itemsEl.innerHTML = `${itemsHTML}`
        if (opts.asTable) itemsEl.prepend(header)

        if (!el.querySelector('.items')) {
          el.append(itemsEl)
        }

        if (!el.querySelector('.controls')) {
          el.prepend(controlsEl)
        }

      } else {
        el.innerHTML = el.innerHTML + `<p>${messages.emptyState}</p>`
      }

      el.classList.remove('fetching')
    }))
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
