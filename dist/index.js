'use strict';

var mobx = require('mobx');

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const delay = function (value) {
  return new Promise(resolve => setTimeout(() => resolve(), value));
};
/**
 * Creates a new data sucker for any RxCollection
 * refreshes data on criteria change
 *
 * @class Subscriber
 * @implements {LodgerSubscriber}
 */


class Subscriber {
  /**
   * Creates an instance of Subscriber.
   *
   * @param {string} name - eg. 'registru'
   * @param {Taxonomy} taxonomy
   * @param {Criteriu} criteriu - initial sort / filter criteria if it shall not use the default one
   * @memberof Subscriber
   */
  constructor(collection, options) {
    this.collection = collection;
    this.options = options;
    this.documents = []; // main data holder, reactive by itself

    this.criteria = {
      limit: 25,
      index: 0,
      sort: {},
      filter: undefined
    };
    this.fetching = false;
    this.subscribed = false;

    this.kill = () => {};

    let fireImmediately = true;

    if (options) {
      const {
        multipleSelect,
        lazy
      } = options;
      if (multipleSelect) this.selectedId = [];
      if (lazy) fireImmediately = false;
    } // Register the reaction on criteria change


    mobx.reaction(() => Object.assign({}, this.criteria), newC => {
      this.kill = this.subscribe(mobx.toJS(newC));
    }, {
      fireImmediately
    });
  }

  get ids() {
    return Object.keys(this.items);
  }

  get items() {
    return Object.assign({}, ...this.documents.map(item => ({
      [item._id]: item._data
    })));
  }

  get selectedDoc() {
    return this.documents.filter(doc => doc._id === this.selectedId)[0];
  }

  get editing() {
    return this.documents.filter(doc => doc._id === this.activeId)[0];
  }

  get length() {
    return this.ids.length;
  }
  /**
   * Observables changes wwhenever data changes
   *
   * @private
   * @param {RxDocument<any>[]} changes
   * @memberof Subscriber
   */


  handleSubscriptionData(changes) {
    if (!this.subscribed) this.subscribed = true;
    this.documents = changes; // defer this a little bit for user friendliness &/or transitions

    setTimeout(() => {
      this.fetching = false;
    }, 100);
  }

  subscribeRequested() {
    this.fetching = true;
  }
  /**
   * (re)Subscribes with given Criteria
   * happens internaly when criteriu is changed
   *
   * @param {Criteriu} [criteriu]
   * @memberof Subscriber
   */


  subscribe({
    limit,
    index,
    sort,
    filter
  }) {
    this.subscribeRequested();
    const {
      options
    } = this;
    limit = Number(limit);
    index = Number(index);
    const paging = options && options.progressivePaging ? limit + limit * index : limit;
    const {
      unsubscribe
    } = this.collection.find(filter).limit(paging).sort(mobx.toJS(sort)).$.subscribe(changes => this.handleSubscriptionData(changes));
    return unsubscribe;
  }
  /**
   * (De)selects an item by it's id
   *
   * @param {string} id
   * @memberof Subscriber
   */


  select(id) {
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


  edit(id) {
    this.activeId = id;
  }

  get updates() {
    return new Promise(resolve => {
      mobx.reaction(() => this.fetching, status => __awaiter(this, void 0, void 0, function* () {
        if (!status) {
          yield delay(50); // quite hacky, waits for @computeds to update

          resolve();
        }
      }));
    });
  }

}

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
