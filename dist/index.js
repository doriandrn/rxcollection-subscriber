'use strict';

// var mobx = require('mobx');

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

var defaultMessages = {
  emptyState: "None",
  multipleSelected: "%s selected",
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
};
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

function render(opts) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _this = this;

    var selector, mapRefFields, el, messages, persistState, controls, _this$collection$sche, indexes, properties, schemaFields, header, controlsEl, selectedControl, subStorageName, mcrit, _mcrit, selectedId, criteria, itemsEl;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (document) {
              _context4.next = 2;
              break;
            }

            throw new Error('Render function only works in browser so far.');

          case 2:
            selector = opts.selector, mapRefFields = opts.mapRefFields;
            el = document.querySelector(selector);

            if (el) {
              _context4.next = 6;
              break;
            }

            throw new Error("Could not find selector ".concat(selector));

          case 6:
            // Default messages object if none supplied
            messages = Object.assign({}, Object.assign({}, defaultMessages), Object.assign({}, opts.messages));
            persistState = opts && opts.persistState !== false; // default is true

            controls = {
              limit: {
                type: 'number'
              },
              filter: {
                type: 'text'
              }
            };
            _this$collection$sche = this.collection.schema, indexes = _this$collection$sche.indexes, properties = _this$collection$sche.jsonSchema.properties;
            schemaFields = Object.keys(properties).filter(function (field) {
              return field.indexOf('_') !== 0;
            });
            mobx.reaction(function () {
              return Object.assign({}, _this.items);
            }, function (items) {
              return __awaiter(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this2 = this;

                var ids, itemsHTML;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        ids = this.ids;
                        itemsHTML = '';
                        console.log(ids.length, selector);
                        el.classList.add('fetching');

                        if (!ids.length) {
                          _context3.next = 14;
                          break;
                        }

                        _context3.next = 7;
                        return Promise.all(ids.map(function (itemId, index) {
                          return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                            var _this3 = this;

                            var item, drel, itemHTML, isSelected;
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    item = items[itemId];
                                    drel = opts && opts.asTable ? schemaFields : Object.keys(item);
                                    _context2.t0 = Array;
                                    _context2.next = 5;
                                    return Promise.all(drel.filter(function (field) {
                                      return field.indexOf('_') !== 0;
                                    }).sort(function (a, b) {
                                      return schemaFields.indexOf(a) - schemaFields.indexOf(b);
                                    }).map(function (field, i) {
                                      return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                        var tag, content, val, _doc, populated, tax;

                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                          while (1) {
                                            switch (_context.prev = _context.next) {
                                              case 0:
                                                tag = i === 0 ? 'strong' : 'span';

                                                if (!(mapRefFields && mapRefFields[field])) {
                                                  _context.next = 11;
                                                  break;
                                                }

                                                if (!(Object.keys(mapRefFields).indexOf(field) > -1)) {
                                                  _context.next = 9;
                                                  break;
                                                }

                                                val = mapRefFields[field].split('.');
                                                _doc = item._doc;
                                                _context.next = 7;
                                                return _doc["".concat(val[0], "_")];

                                              case 7:
                                                populated = _context.sent;

                                                if (populated) {
                                                  if (populated.length > -1) {
                                                    content = populated.map(function (c) {
                                                      if (!c) return;
                                                      tax = tax || c.collection.schema.jsonSchema.title;
                                                      return "<a href=\"#detail?".concat(tax, "=").concat(itemId, "\">").concat(c[val[1]], "</a>");
                                                    }).join('');
                                                  } else {
                                                    content = "<a href=\"#detail?".concat(populated.collection.schema.jsonSchema.title, "=").concat(itemId, "\">").concat(populated[val[1]], "</a>");
                                                  }
                                                }

                                              case 9:
                                                _context.next = 12;
                                                break;

                                              case 11:
                                                content = item[field];

                                              case 12:
                                                if (typeof content === 'string' && content.indexOf('.jpg') === content.length - 4) {
                                                  tag = 'figure';
                                                  content = "<img src=\"".concat(content, "\" />");
                                                }

                                                return _context.abrupt("return", "<".concat(tag, ">").concat(content || '-', "</").concat(tag, ">"));

                                              case 14:
                                              case "end":
                                                return _context.stop();
                                            }
                                          }
                                        }, _callee);
                                      }));
                                    }));

                                  case 5:
                                    _context2.t1 = _context2.sent;
                                    itemHTML = _context2.t0.from.call(_context2.t0, _context2.t1).join('');
                                    isSelected = this.selectedId && this.selectedId.indexOf(itemId) > -1;
                                    return _context2.abrupt("return", "<li data-id=\"".concat(itemId, "\" ").concat(isSelected ? 'class="sel"' : '', ">").concat(itemHTML, "</li>"));

                                  case 9:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2, this);
                          }));
                        }));

                      case 7:
                        itemsHTML = _context3.sent;
                        itemsEl.innerHTML = "".concat(Array.from(itemsHTML).join(''));
                        if (opts.asTable) itemsEl.prepend(header);

                        if (!el.querySelector('.items')) {
                          el.append(itemsEl);
                        }

                        if (!el.querySelector('.controls')) {
                          el.prepend(controlsEl);
                        }

                        _context3.next = 15;
                        break;

                      case 14:
                        el.innerHTML = el.innerHTML + "<p>".concat(messages.emptyState, "</p>");

                      case 15:
                        el.classList.remove('fetching');
                        console.log('Done rendering', selector);

                      case 17:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              }));
            }, {
              fireImmediately: true
            });
            mobx.reaction(function () {
              return _typeof(_this.selectedId) === 'object' ? _toConsumableArray(_this.selectedId) : _this.selectedId;
            }, function (ids) {
              var selectedId = _this.selectedId;

              if (_typeof(selectedId) === 'object') {
                var length = selectedId.length;
                selectedControl.innerHTML = length ? messages.multipleSelected.replace('%s', "<strong>".concat(length, "</strong>")) + "; <a>".concat(messages.deselectAll, "</a>") : '';
              }

              if (persistState) {
                localStorage.setItem(subStorageName, JSON.stringify(Object.assign({}, mcrit, {
                  selectedId: selectedId
                })));
              }
            });
            header = document.createElement('li');
            controlsEl = document.createElement('div');
            selectedControl = document.createElement('span');
            el.dataset.sub = opts.name || this.collection.name;
            el.dataset.ctx = opts.context || 'main';
            subStorageName = "".concat(el.dataset.ctx, "-").concat(el.dataset.sub);
            controlsEl.classList.add('controls');
            controlsEl.append(selectedControl);
            mcrit = {};

            if (persistState && opts.holder) {
              try {
                mcrit = JSON.parse(localStorage.getItem(subStorageName));
              } catch (e) {
                console.log('wtf json parse');
              }

              if (mcrit) {
                _mcrit = mcrit, selectedId = _mcrit.selectedId, criteria = _mcrit.criteria;

                if (selectedId) {
                  this.select(selectedId);
                }

                if (criteria) {
                  this.criteria = Object.assign({}, criteria);
                }
              }
            }

            Object.keys(controls).map(function (control) {
              var controlContainer = document.createElement('span');
              var label = document.createElement('label');
              label.textContent = String(control).toUpperCase();

              switch (control) {
                case 'limit':
                  var input = document.createElement('input');
                  input.type = controls[control].type;
                  input.value = _this.criteria[control];
                  input.addEventListener('change', function (e) {
                    _this.criteria[control] = e.target.value;
                  });
                  controlContainer.append(input);
                  break;

                case 'filter':
                  var but = document.createElement('button');
                  but.textContent = messages.filters.new;
                  var connector = document.createElement('select');
                  var fieldSelect = document.createElement('select');
                  var operator = document.createElement('select');
                  var valInput = document.createElement('input');

                  var ops = function ops(fieldType) {
                    return fieldType === 'number' ? {
                      lt: '<',
                      lte: '<=',
                      gt: '>',
                      gte: '>=',
                      eq: '='
                    } : {
                      in: 'contains',
                      nin: 'does not contain',
                      regex: 'RegEx'
                    };
                  };

                  schemaFields.map(function (field) {
                    var op = document.createElement('option');
                    op.value = field;
                    op.textContent = field;
                    fieldSelect.append(op);
                  }); // const valChange = (operator, input, field) => e => {
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

                  fieldSelect.name = 'field';

                  var fieldChange = function fieldChange(operator, input) {
                    return function (e) {
                      var value = e.target.value;
                      var fieldType = properties[value].type;
                      input.setAttribute('type', fieldType === 'number' ? 'number' : 'text');
                      input.value = null;

                      var _ops = ops(fieldType);

                      operator.innerHTML = '';
                      Object.keys(_ops).map(function (opId) {
                        var opEl = document.createElement('option');
                        opEl.value = opId;
                        opEl.textContent = _ops[opId];
                        operator.append(opEl);
                      });
                    };
                  };

                  var filterEntry = document.createElement('div');
                  filterEntry.append(fieldSelect, operator, valInput);

                  var addFilter = function addFilter() {
                    var filterEl = document.createElement('span');
                    var removeFilter = document.createElement('button');
                    filterEl.classList.add('filter');
                    filterEl.append(removeFilter);
                    removeFilter.textContent = messages.filters.trash;
                    var f = filterEntry.cloneNode(true);
                    var filterIndex = Array.prototype.indexOf.call(controlContainer, f);
                    f.addEventListener('filterUpdated', function (e) {
                      var index = e.detail;
                      var item = filterEl.children[index + 1];
                      console.log('x', index, item);
                      var filters = Array.from(item.children).map(function (c) {
                        return c.value;
                      });
                      var isValid = true;
                      filters.forEach(function (val) {
                        if (!val) isValid = false;
                      });
                      console.log(filters, isValid);
                      if (!isValid) return;
                      but.disabled = false; // this.criteria.filter = filter
                    });
                    Array.from(f.children).forEach(function (child, i) {
                      var event = new CustomEvent('filterUpdated', {
                        detail: filterIndex
                      });
                      child.addEventListener('change', function () {
                        f.dispatchEvent(event);
                      });
                    });
                    f.children[0].addEventListener('change', fieldChange(f.children[1], f.children[2]));
                    filterEl.prepend(f);
                    removeFilter.addEventListener('click', function () {
                      filterEl.remove();
                      but.disabled = false;
                    });
                    controlContainer.append(filterEl);
                  };

                  but.addEventListener('click', function (e) {
                    addFilter();
                    e.target.disabled = true;
                  });
                  controlContainer.append(but);
                  break;
              }

              controlContainer.append(label);
              controlsEl.append(controlContainer);
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
                  var direction = Number(!_this.criteria.sort[field]);
                  _this.criteria.sort = _defineProperty({}, field, direction);
                  span.dataset.dir = direction;
                });
              }

              header.append(span);
            });
            itemsEl = document.createElement('ol');
            itemsEl.start = 0;
            if (opts.asTable) itemsEl.classList.add('table');
            console.log('salut', selector);

            if (persistState) {
              mobx.reaction(function () {
                return Object.assign({}, _this.criteria);
              }, function (criteria) {
                localStorage.setItem(subStorageName, JSON.stringify(Object.assign({}, mcrit, {
                  criteria: criteria
                })));
              });
            }

          case 30:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
}

/**
 * Creates a new data sucker for any RxCollection
 * refreshes data on criteria changes
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
    this.selectedId = '';
    this.name = 'unnamed';
    this.context = 'main';
    this.fields = 'all';

    this.render = function () {};

    this.kill = function () {};

    var fireImmediately = true;

    this.kill = function () {};

    if (options) {
      var multipleSelect = options.multipleSelect,
          lazy = options.lazy,
          criteria = options.criteria,
          fields = options.fields,
          name = options.name,
          context = options.context;
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

      if (name) {
        this.name = name;
      }

      if (context) this.context = context;
    } // Register the reaction on criteria change


    mobx.reaction(function () {
      return Object.assign({}, _this.criteria);
    }, function () {
      return __awaiter(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.subscribe();

              case 2:
                this.kill = _context.sent;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }, {
      fireImmediately: fireImmediately
    }); // if (process && process.browser) {

    this.render = render.bind(this); // }
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
      this.collection.find({
        selector: this.filter
      }).limit(this.paging).sort(mobx.toJS(this.criteria.sort)).$.subscribe(function (docs) {
        if (!_this2.subscribed) _this2.subscribed = true;
        console.log('zzz', _this2.name, docs);
        _this2.documents = docs;
        _this2.fetching = false;
      });
      return this.collection.destroy.bind(this.collection);
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
      var _this3 = this;

      if (typeof this.selectedId !== 'string' && this.selectedId && this.options && this.options.multipleSelect) {
        var select = function select(id) {
          if (typeof id === 'string') {
            if (_this3.selectedId.indexOf(id) < 0) _this3.selectedId.push(id);else _this3.selectedId.splice(_this3.selectedId.indexOf(id), 1);
          } else {
            if (id.length) id.map(function (_id) {
              return select(_id);
            });
          }
        };

        select(id);
      } else {
        this.selectedId = id !== String(this.selectedId) ? id : '';
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
      var _this4 = this;

      var fields = this.fields;
      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(this.documents.map(function (_doc) {
        return _defineProperty({}, _doc[_this4.primaryPath], Object.assign({}, fields && fields !== 'all' ? Object.fromEntries(fields.map(function (f) {
          return [f, _doc[f]];
        })) : _doc._data, {
          _doc: _doc
        }));
      }))));
    }
  }, {
    key: "selectedDoc",
    get: function get() {
      var _this5 = this;

      return this.documents.filter(function (doc) {
        return doc[_this5.primaryPath] === _this5.selectedId;
      })[0];
    }
  }, {
    key: "editing",
    get: function get() {
      var _this6 = this;

      return this.documents.filter(function (doc) {
        return doc[_this6.primaryPath] === _this6.activeId;
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
      var _this7 = this;

      return new Promise(function (resolve) {
        mobx.reaction(function () {
          return _this7.fetching;
        }, function (status) {
          return __awaiter(_this7, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (status) {
                      _context2.next = 4;
                      break;
                    }

                    _context2.next = 3;
                    return this.collection.database.requestIdlePromise();

                  case 3:
                    resolve();

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
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
