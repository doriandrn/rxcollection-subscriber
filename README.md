# RxCollection Subscriber

![Build & Publish to npm](https://github.com/doriandrn/rxcollection-subscriber/workflows/Build%20&%20Publish%20to%20npm/badge.svg)

A powerful tool built on top of RxCollection that allows you to efficiently display real-time data coming from a RxDB in any way you can imagine.

Renderless component that reacts on VM (criteria) changes for RxDB's collections (RxCollection).

<!-- **If you're rather interested in hooking the functionality directly into RxDB, you should check the [rxdb-subs](https://github.com/doriandrn/rxdb-subs) plugin.** - Coming soon! -->

## Features

- Reacts on criteria change;
- State management;
- Selects / Deselects items;
- Lets you keep hold of IDs you're working with;


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
| criteria | Criteria | Initial criteria to subscribe with. also applies to lazy subscribers | `{ limit: 25, index: 0, sort: {}, filter: undefined }`
| fields | all / string[] | Fields the .items holder should contain for items. Fields starting with `_` such as `_id` or `_rev` are always contained. | 'all'
| multipleSelect | bool | Allows multiple ids & documents to be selected | false
| lazy | bool | does not subscribe on construct | false
| progressivePaging | bool | whenever the `index` key in criteria changes / increases, results will not be paginated but appended to previous | false
| autoSelectOnCRUD | bool | if a new document gets added / removed from the collection, it'll immediately get selected | false

### API

| command | description |
| :----- | :----------- |
| `select( ids : string | string[] )` | This works in 2 ways. With `multipleSelect` option enabled it adds / removees the itemId from the .selectedIds list, otherwise it just selects / deselects that item. If the render function is used, this is cached in localStorage |
| `render( options ?: RenderOptions )` | Renders the data. Only works in browser, client-side. |

## Contribute

- [Code of conduct - Read this before contributing](./CODE_OF_CONDUCT.md)
- [Guide](./CONTRIBUTE.md)

## License

[Apache-2.0](./LICENSE)

## Footnotes

### Compatibility

- Works in Node & Browser (IE 11+);
- Compatible with any framework;
