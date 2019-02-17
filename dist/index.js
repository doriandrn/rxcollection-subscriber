'use strict';

var mobx = require('mobx');

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
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
 * @implements {LodgerSubscriber}
 */


var Subscriber =
/*#__PURE__*/
function () {
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
    this.documents = []; // main data holder, reactive by itself

    this.criteria = {
      limit: 25,
      index: 0,
      sort: {},
      filter: {}
    };
    this.fetching = false;
    this.subscribed = false;

    this.kill = function () {};

    var fireImmediately = true;

    if (options) {
      var multipleSelect = options.multipleSelect,
          lazy = options.lazy;
      if (multipleSelect) this.selectedId = [];
      if (lazy) fireImmediately = false;
    } // Register the reaction on criteria change


    mobx.reaction(function () {
      return Object.assign({}, _this.criteria);
    }, function (newC) {
      _this.kill = _this.subscribe(mobx.toJS(newC));
    }, {
      fireImmediately: fireImmediately
    });
  }

  _createClass(Subscriber, [{
    key: "handleSubscriptionData",

    /**
     * Handles new documents received from RxCollection Subscription
     *
     * @private
     * param {RxDocument<any>[]} changes
     * @memberof Subscriber
     */
    value: function handleSubscriptionData(changes) {
      var _this2 = this;

      if (!this.subscribed) this.subscribed = true;
      this.documents = changes; // defer this a little bit for user friendliness &/or transitions

      setTimeout(function () {
        _this2.fetching = false;
      }, 100);
    }
  }, {
    key: "subscribeRequested",
    value: function subscribeRequested() {
      this.fetching = true;
    }
    /**
     * (re)Subscribes with given Criteria
     * happens internaly when criteria is changed
     *
     * @param {Criteriu} [criteriu]
     * @memberof Subscriber
     */

  }, {
    key: "subscribe",
    value: function subscribe(_ref) {
      var _this3 = this;

      var limit = _ref.limit,
          index = _ref.index,
          sort = _ref.sort,
          filter = _ref.filter;
      this.subscribeRequested();
      var options = this.options;
      limit = Number(limit);
      index = Number(index);
      var paging = options && options.progressivePaging ? limit + limit * index : limit;

      var _this$collection$find = this.collection.find(filter).limit(paging).sort(mobx.toJS(sort)).$.subscribe(function (changes) {
        return _this3.handleSubscriptionData(changes);
      }),
          unsubscribe = _this$collection$find.unsubscribe;

      return unsubscribe;
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
      var _this4 = this;

      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(this.documents.map(function (item) {
        return _defineProperty({}, item[_this4.primaryPath], item._data);
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
    key: "updates",
    get: function get() {
      var _this7 = this;

      return new Promise(function (resolve) {
        mobx.reaction(function () {
          return _this7.fetching;
        }, function (status) {
          return __awaiter(_this7, void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (status) {
                      _context.next = 4;
                      break;
                    }

                    _context.next = 3;
                    return delay(50);

                  case 3:
                    // quite hacky, waits for @computeds to update
                    resolve();

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
        });
      });
    }
  }]);

  return Subscriber;
}();

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

__decorate([mobx.action], Subscriber.prototype, "handleSubscriptionData", null);

__decorate([mobx.action], Subscriber.prototype, "subscribeRequested", null);

__decorate([mobx.action], Subscriber.prototype, "select", null);

__decorate([mobx.action], Subscriber.prototype, "edit", null);

module.exports = Subscriber;
