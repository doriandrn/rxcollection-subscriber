'use strict';

// var mobx = require('mobx');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var delay = function delay(value) {
  return new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve();
    }, value);
  });
};
/**
 * Creates a new data sucker for any RxCollection
 * refreshes data on criteria change
 *
 * @class Subscriber
 * @implements {RxSubscriber}
 */


var Subscriber = /*#__PURE__*/function () {
  /**
   * Creates an instance of Subscriber.
   *
   * @param {string} name
   * @param {RxCollection} collection
   * @param {SubscriberOptions} options
   *
   * @memberof Subscriber
   */
  function Subscriber(collection, options) {
    var _this = this;

    _classCallCheck(this, Subscriber);

    this.collection = collection;
    this.options = options;
    this.documents = [];
    this.criteria = {
      limit: 25,
      index: 0,
      sort: {},
      filter: undefined
    };
    this.fetching = false;
    this.subscribed = false;

    this.kill = function () {};

    var fireImmediately = true;

    this.kill = function () {};

    if (options) {
      var multipleSelect = options.multipleSelect,
          lazy = options.lazy,
          criteria = options.criteria,
          fields = options.fields;
      if (multipleSelect) this.selectedId = [];
      if (lazy) fireImmediately = false;

      if (criteria) {
        Object.keys(criteria).forEach(function (key) {
          return _this.criteria[key] = criteria[key];
        });
      }

      if (fields) {
        this.fields = fields;
      }
    } // Register the reaction on criteria change


    mobx.reaction(function () {
      return Object.assign({}, _this.criteria);
    }, function () {
      _this.kill = _this.subscribe();
    }, {
      fireImmediately: fireImmediately
    });
  }

  _createClass(Subscriber, [{
    key: "subscribe",

    /**
     * (re)Subscribes with given Criteria
     * happens internaly when criteria is changed
     *
     * @param {Criteriu} [criteriu]
     * @memberof Subscriber
     */
    value: function subscribe() {
      var _this2 = this;

      this.fetching = true;
      this.query = this.collection.find(this.filter).limit(this.paging).sort(mobx.toJS(this.criteria.sort)); // .exec()

      this.query.$.subscribe(function (docs) {
        if (!_this2.subscribed) _this2.subscribed = true;
        _this2.documents = docs;
        _this2.fetching = false;
      });
      return this.collection.destroy.bind(this.collection);
    }
    /**
     * Implicit render function
     * Renders pure HTML
     *
     * By default, fields starting with "_" are excluded
     *
     *
     * @param {RenderOptions} opts
     * @memberof Subscriber
     */

  }, {
    key: "render",
    value: function render(opts) {
      var _this3 = this;

      // This function is only for the browser but it could also work
      // in console / teerminal. Imagine that! An app running in the console! Dev swag at it's finest
      if (!document) {
        throw new Error('Render function only works in browser so far.');
      }

      var selector = opts.selector,
          messages = opts.messages; // Default messages object if none supplied

      messages = messages || {
        emptyState: "None"
      };
      var el = document.querySelector(selector);
      if (!el) throw new Error('Could not find selector', selector);
      el.dataset.sub = this.collection.name;
      var header = document.createElement('li');
      var controls = document.createElement('div');
      controls.classList.add('controls');
      var _this$collection$sche = this.collection.schema,
          indexes = _this$collection$sche.indexes,
          properties = _this$collection$sche.jsonSchema.properties;
      var schemaFields = Object.keys(properties).filter(function (field) {
        return field.indexOf('_') !== 0;
      });
      schemaFields.map(function (field) {
        var isSortable = indexes.length && indexes.filter(function (index) {
          return index.indexOf(field) > -1;
        }).length;
        var span = document.createElement('span');
        span.textContent = field;

        if (isSortable) {
          span.classList.add('sortable');
          span.addEventListener('click', function () {
            var direction = Number(!_this3.criteria.sort[field]);
            _this3.criteria.sort = _defineProperty({}, field, direction);
            span.dataset.dir = direction;
          });
        }

        header.append(span);
      });
      var itemsEl = document.createElement('ol');
      itemsEl.start = 0;
      if (opts.asTable) itemsEl.classList.add('table');
      mobx.reaction(function () {
        return Object.assign({}, _this3.items);
      }, function (items) {
        return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var _this4 = this;

          var itemsHTML, itemsList;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  console.log('REACTIN', items);
                  itemsHTML = '';
                  itemsList = Object.keys(this.items);
                  el.classList.add('fetching');

                  if (itemsList.length) {
                    itemsList.map(function (itemId, index) {
                      var item = _this4.items[itemId];
                      itemsHTML += "<li data-id=\"".concat(itemId, "\">");

                      Object.keys(item).filter(function (field) {
                        return field.indexOf('_') !== 0;
                      }).sort(function (a, b) {
                        return schemaFields.indexOf(a) - schemaFields.indexOf(b);
                      }).map(function (field, i) {
                        var tag = i === 0 ? 'strong' : 'span';
                        var content = item[field];

                        if (typeof content === 'string' && content.indexOf('.jpg') === content.length - 4) {
                          tag = 'figure';
                          content = "<img src=\"".concat(content, "\" />");
                        }

                        itemsHTML += "<".concat(tag, ">").concat(content, "</").concat(tag, ">"); // this has to stay as minimal as this
                      });
                      itemsHTML += "</li>";
                    });
                    itemsEl.innerHTML = "".concat(itemsHTML);
                    if (opts.asTable) itemsEl.prepend(header);

                    if (!el.querySelector('.items')) {
                      el.append(itemsEl);
                    }

                    if (!el.querySelector('.controls')) {
                      el.prepend(controls);
                    }
                  } else {
                    el.innerHTML = el.innerHTML + "<p>".concat(messages.emptyState, "</p>");
                  }

                  el.classList.remove('fetching');

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      });
    }
    /**
     * (De)selects an item by it's id
     *
     * @param {string} id
     * @memberof Subscriber
     */

  }, {
    key: "select",
    value: function select(id) {
      if (typeof this.selectedId !== 'string' && this.selectedId && this.options && this.options.multipleSelect) {
        if (this.selectedId.indexOf(id) < 0) this.selectedId.push(id);else this.selectedId.splice(this.selectedId.indexOf(id), 1);
      } else {
        this.selectedId = id;
      }
    }
    /**
     * Sets the active document to be furtherly edited
     *
     * @param {string} id
     * @memberof Subscriber
     */

  }, {
    key: "edit",
    value: function edit(id) {
      this.activeId = id;
    }
  }, {
    key: "ids",
    get: function get() {
      return Object.keys(this.items);
    }
  }, {
    key: "items",
    get: function get() {
      var _this5 = this;

      var fields = this.fields;
      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(this.documents.map(function (item) {
        return _defineProperty({}, item[_this5.primaryPath], fields ? Object.fromEntries(fields.map(function (f) {
          return [f, item[f]];
        })) : item._data);
      }))));
    }
  }, {
    key: "selectedDoc",
    get: function get() {
      var _this6 = this;

      return this.documents.filter(function (doc) {
        return doc[_this6.primaryPath] === _this6.selectedId;
      })[0];
    }
  }, {
    key: "editing",
    get: function get() {
      var _this7 = this;

      return this.documents.filter(function (doc) {
        return doc[_this7.primaryPath] === _this7.activeId;
      })[0];
    }
  }, {
    key: "length",
    get: function get() {
      return this.ids.length;
    }
  }, {
    key: "primaryPath",
    get: function get() {
      return this.collection.schema.primaryPath || '_id';
    }
  }, {
    key: "filter",
    get: function get() {
      return this.criteria.filter;
    }
  }, {
    key: "paging",
    get: function get() {
      var options = this.options;
      var limit = Number(this.criteria.limit);
      var index = Number(this.criteria.index);
      return options && options.progressivePaging ? limit + limit * index : limit;
    }
  }, {
    key: "updates",
    get: function get() {
      var _this8 = this;

      return new Promise(function (resolve) {
        mobx.reaction(function () {
          return _this8.fetching;
        }, function (status) {
          return __awaiter(_this8, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (status) {
                      _context2.next = 4;
                      break;
                    }

                    _context2.next = 3;
                    return delay(50);

                  case 3:
                    // quite hacky, waits for @computeds to update
                    resolve();

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));
        });
      });
    }
  }]);

  return Subscriber;
}();

__decorate([mobx.observable], Subscriber.prototype, "documents", void 0);

__decorate([mobx.observable], Subscriber.prototype, "criteria", void 0);

__decorate([mobx.observable], Subscriber.prototype, "fetching", void 0);

__decorate([mobx.observable], Subscriber.prototype, "subscribed", void 0);

__decorate([mobx.observable], Subscriber.prototype, "selectedId", void 0);

__decorate([mobx.observable], Subscriber.prototype, "activeId", void 0);

__decorate([mobx.computed], Subscriber.prototype, "ids", null);

__decorate([mobx.computed], Subscriber.prototype, "items", null);

__decorate([mobx.computed], Subscriber.prototype, "selectedDoc", null);

__decorate([mobx.computed], Subscriber.prototype, "editing", null);

__decorate([mobx.computed], Subscriber.prototype, "length", null);

__decorate([mobx.computed], Subscriber.prototype, "filter", null);

__decorate([mobx.computed], Subscriber.prototype, "paging", null);

__decorate([mobx.action], Subscriber.prototype, "select", null);

__decorate([mobx.action], Subscriber.prototype, "edit", null);

module.exports = Subscriber;
