import { RxCollection, isRxDocument, RxDatabase, create, plugin, RxCollectionCreator } from 'rxdb'
import memoryAdapter from 'pouchdb-adapter-memory'
import faker from 'faker'

import Subscriber from './Subscriber'

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Inserts n items to collection
 * @param n
 */
async function insertNitems (n: number) {
  for (let i = 0; i < n; i ++ ) {
    await this.insert({ name: faker.name.firstName(), dummyLevel: faker.random.number() })
  }
}

const testCol: RxCollectionCreator = {
  name: 'dummies',
  schema: {
    title: 'dummy',
    version: 0,
    type: 'object',
    properties: {
      name: {
        type: 'string',
        index: true
      },
      dummyLevel: {
        type: 'number'
      }
    }
  }
}

describe('RxCollection Subscriber', () => {
  let db: RxDatabase
  let collection: RxCollection

  beforeAll(async () => {
    plugin(memoryAdapter)
    db = await create({
      name :'testdb',
      adapter: 'memory',
      ignoreDuplicate: true
    })
    collection = await db.collection(testCol)
    await insertNitems.call(collection, 10)
  })

  afterAll(async () => { await db.destroy() })

  describe('constructor', () => {
    describe('options', () => {
      describe('.progressivePaging = true', () => {
        let subscriber: Subscriber<any>, limit: number = 2

        beforeAll(async () => {
          subscriber = new Subscriber(collection, { progressivePaging: true })
          subscriber.criteria.limit = limit
          await subscriber.updates
        })

        afterAll(() => subscriber.kill())

        test(`shows ${limit}`, () => {
          expect(subscriber.length).toEqual(limit)
        })

        describe('index increases', () => {
          beforeEach(async () => {
            subscriber.criteria.index += 1
            await subscriber.updates
          })
          test(`shows ${limit * 2}`, () => {
            expect(subscriber.ids.length).toEqual(limit * 2)
          })

          test(`shows ${limit + limit * 2}`, () => {
            expect(subscriber.ids.length).toEqual(limit + limit * 2)
          })
        })
      })

      describe('.multipleSelect = true', () => {
        let subscriber: Subscriber<any>, oneRandomId: string

        beforeAll(async () => {
          subscriber = new Subscriber(collection, { multipleSelect: true })
          await insertNitems.call(collection, 10)
          await subscriber.updates
          oneRandomId = subscriber.ids[getRandomInt(9)]
        })

        afterAll(() => subscriber.kill())

        describe('.selectedIds', () => {
          test('is array', () => {
            expect(subscriber.selectedId.length).toEqual(0)
          })
        })

        describe('.select()', () => {
          describe('selects & deselects an id', () => {
            beforeEach(() => { subscriber.select(oneRandomId) })

            test('selects', () => {
              expect(subscriber.selectedId).toContain(oneRandomId)
            })
            test('deselects', () => {
              expect(subscriber.selectedId).not.toContain(oneRandomId)
            })
          })

          describe('selects multiple', () => {
            let toBeSelected: string[]

            beforeAll(() => {
              toBeSelected = subscriber.ids.splice(0, 3)
              toBeSelected.forEach(id => subscriber.select(id))
            })

            test('ok', () => {
              expect(subscriber.selectedId).toEqual(expect.arrayContaining(toBeSelected))
            })
          })

        })
      })
    })
  })

  describe('Observes data', () => {
    let subscriber: Subscriber<any>
    let _id: string

    beforeAll(async () => {
      subscriber = new Subscriber(collection)
      const item = await collection.insert({ name: 'gigi', dummyLevel: 5 })
      _id = item._id
      await subscriber.updates
    })

    afterAll(() => subscriber.kill())

    test('.fetching = false', () => {
      expect(subscriber.fetching).toBeFalsy()
    })

    test('.ids contains the newly added item id', () => {
      expect(subscriber.ids).toContain(_id)
    })

    test('.items has the key with ID', () => {
      expect(subscriber.items[_id]).toBeDefined()
    })
  })

  describe('.criteria', () => {
    let tester: Subscriber<any>

    beforeEach(() => { tester = new Subscriber(collection) })
    afterEach(() => { tester.kill() })

    describe('Change reactions', () => {

      test('.fetching = true whenever criteria changes', () => {
        tester.criteria.limit = 1
        expect(tester.fetching).toBeTruthy()
      })

      describe('.limit', () => {
        let limit = 3

        beforeEach(async () => {
          tester.criteria.limit = limit
          await tester.updates
        })

        test('getter is equal', () => {
          expect(tester.criteria.limit).toEqual(limit)
        })

        test('ids length match', () => {
          expect(tester.ids.length).toEqual(limit)
        })

        test('reacts & resubscribes on immediate re-change', () => {
          limit = 2
          tester.criteria.limit = limit
          expect(tester.criteria.limit).toBe(limit)
        })
      })

      describe('.index', () => {
        let index = 1
        let idsCurrentIndex

        beforeAll(async () => {
          idsCurrentIndex = tester.ids
          tester.criteria.index = index
          await tester.updates
        })

        test('indexes length has increased', () => {
          expect(idsCurrentIndex.length).toBeGreaterThan(tester.ids.length )
        })
      })

      describe('.filter', () => {})

      describe('.sort', () => {
        let sort = { name: 1 }
        const firstAZname = 'Aaa'
        const firstZAname = 'zzz'

        beforeAll(async () => {
          await collection.insert({ name: firstAZname, dummyLevel: 9 })
          await collection.insert({ name: firstZAname, dummyLevel: 9 })
        })

        describe('AZ', () => {
          beforeEach(async () => {
            tester.criteria.sort = { name: 1 }
            await tester.updates
          })

          test('updates accordingly', () => {
            expect(tester.criteria.sort).toEqual(sort)
          })

          test(`first item name is ${firstAZname}`, () => {
            const { items, ids } = tester
            expect(items[Object.keys(items)[0]].name).toEqual(firstAZname)
            expect(items[ids[0]].name).toEqual(firstAZname)
          })
        })

        describe('ZA', () => {
          beforeEach(async () => {
            tester.criteria.sort = { name: -1 }
            await tester.updates
          })

          test(`first item name is ${firstZAname}`, () => {
            const { items, ids } = tester
            expect(items[ids[0]].name).toEqual(firstZAname)
          })
        })
      })
    })
  })

  describe('.select()', () => {
    let oneRandomId: string = ''
    let sub: Subscriber<any>
    const noOfItems = 10 // number of items to insert

    beforeAll(async () => {
      sub = new Subscriber(collection)
      insertNitems.call(collection, noOfItems)
      await sub.updates
    })

    afterAll(() => sub.kill())

    beforeEach(() => {
      oneRandomId = sub.ids[getRandomInt(noOfItems - 1)]
      sub.select(oneRandomId)
    })

    test('.selectedId is the random chosen id', () => {
      expect(sub.selectedId).toEqual(oneRandomId)
    })

    describe('.selectedDoc', () => {
      test('is RxDocument', () => {
        expect(isRxDocument(sub.selectedDoc)).toBeTruthy()
      })

      test('is the right one', () => {
        expect(sub.selectedDoc._id).toEqual(oneRandomId)
      })
    })

  })
})
