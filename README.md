# RxCollection Subscriber

Ready to render, data-suckers for [RxCollection](https://rxdb.info/rx-collection.html)s that react on criteria change (the view model).

If you're rather interested in hooking the functionality directly into RxDB, you should check the [rxdb-subs]() plugin.

## Usage

```js
import Subscriber from 'rxcollection-subscriber'

const sub1 = new Subscriber(collection)
const sub2 = new Subscriber(collection, { criteria: { limit: 3 } })

console.log(sub1.criteria) // the view model.
sub1.criteria.index = 2
console.log(sub1.items) // render this -> main data holder

// select a document
sub1.select(sub1.ids[0])

// get the active RxDocument
console.log(sub1.selectedDoc)
```

### Options

| key | type | description | default |
|:------|:---- |:------------|:---------|
| criteria | Criteria | initial criteria to subscribe with. also applies to lazy subscribers | `{ limit: 25, index: 0, sort: {}, filter: undefined }`
| multipleSelect | bool | allows multiple ids & documents to be selected | false
| lazy | bool | does not subscribe on construct | false
| progressivePaging | bool | whenever the `index` key in criteria changes / increases, results will not be paginated but appended to previous | false
| autoSelectOnCRUD | bool | if a new document gets added / removed from the collection, it'll immediately get selected | false

## Contribute

- [Code of conduct - Read this before contributing](./CODE_OF_CONDUCT.md)
- [Guide](./CONTRIBUTE.md)

## License

[Apache-2.0](./LICENSE)
