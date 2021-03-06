import { reaction } from 'mobx'
import  Subscriber from '../Subscriber'

export type RenderOptions = {
  selector: string
  name ?: string
  context ?: string
  messages ?: {},
  persistState ?: boolean,
  controls ?: boolean,
  mapRefFields ?: string[],
  holder ?: Subscriber<any>[]
  asTable ?: boolean
}

type RendererI18n = {

}

const defaultMessages: RendererI18n = {
  emptyState: `None`,
  multipleSelected: `%s selected`,
  deselectAll: 'Clear',
  noResults: 'No results matching selected criteria',
  filters: {
    new: 'Add filter',
    trash: 'Remove filter',
    disable: 'Disable filter',
    enable: 'Enable filter',
    connectors: {
      or: 'Or',
      nor: 'Nor',
      and: 'And'
    }
  }
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
export default async function render (opts: RenderOptions) {
  if (!document)
    throw new Error('Render function only works in browser so far.')

  const { selector, mapRefFields } = opts

  const el: HTMLElement | null = document.querySelector(selector)
  if (!el)
    throw new Error(`Could not find selector ${selector}`)

  // Default messages object if none supplied
  const messages = Object.assign({}, { ...defaultMessages }, { ...opts.messages })

  const persistState = opts && opts.persistState !== false // default is true

  const {
    indexes,
    jsonSchema: {
      properties
    }
  } = this.collection.schema

  const schemaFields = Object
    .keys(properties)
    .filter(field => field.indexOf('_') !== 0)

  const header = document.createElement('li')

  el.dataset.sub = opts.name || this.collection.name
  el.dataset.ctx = opts.context || 'main'

  const subStorageName = `${ this.collection.database.name }-${ el.dataset.ctx }-${ el.dataset.sub }`
  let mcrit = {}
  let selectedControl: HTMLElement

  reaction(() => ({ ...this.items }), (async (items) => {
    const { ids } = this
    let itemsHTML: string | string[] = ''

    el.classList.add('fetching')

    if (ids.length) {
      itemsHTML = await Promise.all(ids.map(async (itemId, index) => {
        const item = items[itemId]
        const drel = opts && opts.asTable ?
        schemaFields :
        Object.keys(item)

        const itemHTML = Array.from(await Promise.all(
          drel
          .filter(field =>  field.indexOf('_') !== 0)
          .sort((a, b) => schemaFields.indexOf(a) - schemaFields.indexOf(b))
          .map(async (field, i) => {
            let tag = i === 0 ? 'strong' : 'span'
            let content

            // populate fields as req in mapRefFields
            if (mapRefFields && mapRefFields[field]) {
              if (Object.keys(mapRefFields).indexOf(field) > -1) {
                const val = mapRefFields[field].split('.')
                const { _doc } = item
                const populated = await _doc[`${val[0]}_`]

                if (populated) {
                  if (populated.length > -1) {
                    let tax: string
                    content =
                      populated.map(c => {
                        if (!c) return
                        tax = tax || c.collection.schema.jsonSchema.title
                        return `<a href="#detail?${tax}=${itemId}">${c[val[1]]}</a>`
                      }).join('')
                  } else {
                    content = `<a href="#detail?${populated.collection.schema.jsonSchema.title}=${itemId}">${populated[val[1]]}</a>`
                  }
                }
              }
            } else {
              content = item[field]
            }

            if (typeof content === 'string' && content.indexOf('.jpg') === content.length - 4) {
              tag = 'figure'
              content = `<img src="${content}" />`
            }
            return `<${tag}>${content || '-'}</${tag}>` // this has to stay as minimal as this
          }))).join('')

        const isSelected = this.selectedId && this.selectedId.indexOf(itemId) > -1

        return `<li data-id="${itemId}" class="${ isSelected ? 'sel' : ''}">${itemHTML}</li>`
      }))

      itemsEl.innerHTML = `${Array.from(itemsHTML).join('')}`
      if (opts.asTable) itemsEl.prepend(header)

      if (!el.querySelector('.items')) {
        el.append(itemsEl)
      }

      const emptyP = el.querySelector('p.empty')
      if (emptyP) {
        emptyP.remove()
      }

    } else {
      el.innerHTML = el.innerHTML + `<p class="empty">${messages.emptyState}</p>`
    }

    el.classList.remove('fetching')
  }), { fireImmediately: true })

  reaction(() => typeof this.selectedId === 'object' ? [ ...this.selectedId ] : this.selectedId, ids => {
    const { selectedId } = this
    if (selectedControl && typeof selectedId === 'object') {
      const { length } = selectedId
      selectedControl.innerHTML = length ?
        messages.multipleSelected.replace('%s', `<strong>${length}</strong>`) + `; <a>${messages.deselectAll}</a>` :
        ''
    }
    if (persistState) {
      localStorage.setItem(subStorageName, JSON.stringify(Object.assign({}, mcrit, { selectedId })))
    }
  })


  if (opts.controls) {
    const controls = {
      limit: { type: 'number' },
      filter: { type: 'text' }
    }
    const controlsEl = document.createElement('div')
    selectedControl = document.createElement('span')

    controlsEl.classList.add('controls')
    controlsEl.append(selectedControl)

    if (!el.querySelector('.controls')) {
      el.prepend(controlsEl)
    }

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
          but.textContent = messages.filters.new

          const connector = document.createElement('select')
          const fieldSelect = document.createElement('select')
          const operator = document.createElement('select')
          const valInput = document.createElement('input')

          const ops = (fieldType: string) => fieldType === 'number' ?
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

          // const valChange = (operator, input, field) => e => {
          //   const { value } = e.target
          //   if (!value) return

          //   but.disabled = false

          //   const filterValue = { [field.value]: {
          //     [`$${operator.value}`]: input.type === 'number' ?
          //       Number(input.value) :
          //       String(input.value)
          //   }}
          //   console.log('fv', filterValue)
          //   this.criteria.filter = filterValue
          // }

          fieldSelect.name = 'field'
          const fieldChange = (operator, input) => e => {
            const { value } = e.target
            const fieldType = properties[value].type

            input.setAttribute('type', fieldType === 'number' ? 'number' : 'text')
            input.value = null

            const _ops = ops(fieldType)

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


          const filterEntry = document.createElement('div')
          filterEntry.append(fieldSelect, operator, valInput)

          function addFilter () {
            const filterEl = document.createElement('span')
            const removeFilter = document.createElement('button')

            filterEl.classList.add('filter')
            filterEl.append(removeFilter)
            removeFilter.textContent = messages.filters.trash

            const f = filterEntry.cloneNode(true)
            const filterIndex = Array.prototype.indexOf.call(controlContainer, f)

            f.addEventListener('filterUpdated', e => {
              const index = e.detail
              const item = filterEl.children[index + 1]
              console.log('x', index, item)
              const filters = Array.from(item.children).map(c => c.value)
              let isValid = true
              filters.forEach(val => {
                if (!val) isValid = false
              })
              console.log(filters, isValid)
              if (!isValid) return
              but.disabled = false
              // this.criteria.filter = filter
            })

            Array.from(f.children).forEach((child, i) => {
              const event = new CustomEvent('filterUpdated', { detail: filterIndex })
              child.addEventListener('change', () => {
                f.dispatchEvent(event)
              })
            })
            f.children[0].addEventListener('change', fieldChange(f.children[1], f.children[2]))

            filterEl.prepend(f)
            removeFilter.addEventListener('click', () => {
              filterEl.remove()
              but.disabled = false
            })

            controlContainer.append(filterEl)
          }

          but.addEventListener('click', e => {
            addFilter()
            e.target.disabled = true
          })
          controlContainer.append(but)
          break
      }

      controlContainer.append(label)
      controlsEl.append(controlContainer)
    })
  }

  if (persistState && opts.holder) {
    try {
      mcrit = JSON.parse(localStorage.getItem(subStorageName))
    } catch (e) {
      console.log('wtf json parse')
    }
    if (mcrit) {
      const { selectedId, criteria } = mcrit
      if (selectedId) {
        this.select(selectedId)
      }
      if (criteria) {
        this.criteria = { ...criteria }
      }
    }
  }

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

  if (persistState) {
    reaction(() => ({ ...this.criteria }), criteria => {
      localStorage.setItem(subStorageName, JSON.stringify(Object.assign({}, mcrit, { criteria })))
    })
  }
}
