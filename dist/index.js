'use strict';

if (!mobx) var mobx = require('mobx');

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
          lazy = options.lazy;
      if (multipleSelect) this.selectedId = [];
      if (lazy) fireImmediately = false;
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
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.fetching = true;
                _context2.next = 3;
                return this.collection.find(this.filter).limit(this.paging).sort(mobx.toJS(this.criteria.sort)).exec();

              case 3:
                this.documents = _context2.sent;
                this.fetching = false;
                return _context2.abrupt("return", this.collection.destroy.bind(this.collection));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
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
      var _this2 = this;

      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(this.documents.map(function (item) {
        return _defineProperty({}, item[_this2.primaryPath], item._data);
      }))));
    }
  }, {
    key: "selectedDoc",
    get: function get() {
      var _this3 = this;

      return this.documents.filter(function (doc) {
        return doc[_this3.primaryPath] === _this3.selectedId;
      })[0];
    }
  }, {
    key: "editing",
    get: function get() {
      var _this4 = this;

      return this.documents.filter(function (doc) {
        return doc[_this4.primaryPath] === _this4.activeId;
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
      var _this5 = this;

      return new Promise(function (resolve) {
        mobx.reaction(function () {
          return _this5.fetching;
        }, function (status) {
          return __awaiter(_this5, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (status) {
                      _context3.next = 4;
                      break;
                    }

                    _context3.next = 3;
                    return delay(50);

                  case 3:
                    // quite hacky, waits for @computeds to update
                    resolve();

                  case 4:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
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

if (module) module.exports = Subscriber;
