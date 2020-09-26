"use strict";var mobx=require("mobx");function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,i=new Array(t);r<t;r++)i[r]=e[r];return i}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function __decorate(e,t,r,i){var n,o=arguments.length,c=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;0<=a;a--)(n=e[a])&&(c=(o<3?n(c):3<o?n(t,r,c):n(t,r))||c);return 3<o&&c&&Object.defineProperty(t,r,c),c}function __awaiter(e,c,a,s){return new(a=a||Promise)(function(r,t){function i(e){try{o(s.next(e))}catch(e){t(e)}}function n(e){try{o(s.throw(e))}catch(e){t(e)}}function o(e){var t;e.done?r(e.value):((t=e.value)instanceof a?t:new a(function(e){e(t)})).then(i,n)}o((s=s.apply(e,c||[])).next())})}var Subscriber=function(){function l(e,t){var r=this;_classCallCheck(this,l),this.collection=e,this.options=t,this.documents=[],this.criteria={limit:25,index:0,sort:{},filter:void 0},this.fetching=!1,this.subscribed=!1,this.selectedId="",this.name="unnamed",this.context="main",this.fields="all",this.kill=function(){};var i,n,o,c,a,s,u=!0;this.kill=function(){},t&&(i=t.multipleSelect,n=t.lazy,o=t.criteria,c=t.fields,a=t.name,s=t.context,i&&(this.selectedId=[]),n&&(u=!1),o&&Object.keys(o).forEach(function(e){return r.criteria[e]=o[e]}),c&&(this.fields=c),a&&(this.name=a),s&&(this.context=s)),mobx.reaction(function(){return Object.assign({},r.criteria)},function(){return __awaiter(r,void 0,void 0,regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.query=this.collection.find({selector:this.filter||{}}).limit(this.paging).sort(mobx.toJS(this.criteria.sort)),e.next=3,this.subscribe();case 3:this.kill=e.sent;case 4:case"end":return e.stop()}},e,this)}))},{fireImmediately:u})}return _createClass(l,[{key:"subscribe",value:function(){return __awaiter(this,void 0,void 0,regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.fetching=!0,e.next=3,this.query.exec();case 3:return this.documents=e.sent,this.fetching=!1,this.subscribed||(this.subscribed=!0),e.abrupt("return",this.collection.destroy.bind(this.collection));case 7:case"end":return e.stop()}},e,this)}))}},{key:"select",value:function(e){var t,r=this;"string"!=typeof this.selectedId&&this.selectedId&&this.options&&this.options.multipleSelect?(t=function e(t){"string"==typeof t?r.selectedId.indexOf(t)<0?r.selectedId.push(t):r.selectedId.splice(r.selectedId.indexOf(t),1):t.length&&t.map(e)},t(e)):this.selectedId=e!==String(this.selectedId)?e:""}},{key:"edit",value:function(e){this.activeId=e}},{key:"ids",get:function(){return Object.keys(this.items)}},{key:"items",get:function(){var e=this,r=this.fields;return Object.assign.apply(Object,[{}].concat(_toConsumableArray(this.documents.map(function(t){return _defineProperty({},t[e.primaryPath],Object.assign({},r&&"all"!==r?Object.fromEntries(r.map(function(e){return[e,t[e]]})):t._data,{_doc:t}))}))))}},{key:"selectedDoc",get:function(){var t=this;return this.documents.filter(function(e){return e[t.primaryPath]===t.selectedId})[0]}},{key:"editing",get:function(){var t=this;return this.documents.filter(function(e){return e[t.primaryPath]===t.activeId})[0]}},{key:"length",get:function(){return this.ids.length}},{key:"primaryPath",get:function(){return this.collection.schema.primaryPath||"_id"}},{key:"filter",get:function(){return this.criteria.filter}},{key:"paging",get:function(){var e=this.options,t=Number(this.criteria.limit),r=Number(this.criteria.index);return e&&e.progressivePaging?t+t*r:t}},{key:"updates",get:function(){var e=this;return new Promise(function(r){mobx.reaction(function(){return e.fetching},function(t){return __awaiter(e,void 0,void 0,regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=4;break}return e.next=3,this.collection.database.requestIdlePromise();case 3:r();case 4:case"end":return e.stop()}},e,this)}))})})}}]),l}();__decorate([mobx.observable],Subscriber.prototype,"documents",void 0),__decorate([mobx.observable],Subscriber.prototype,"criteria",void 0),__decorate([mobx.observable],Subscriber.prototype,"fetching",void 0),__decorate([mobx.observable],Subscriber.prototype,"subscribed",void 0),__decorate([mobx.observable],Subscriber.prototype,"selectedId",void 0),__decorate([mobx.observable],Subscriber.prototype,"activeId",void 0),__decorate([mobx.computed],Subscriber.prototype,"ids",null),__decorate([mobx.computed],Subscriber.prototype,"items",null),__decorate([mobx.computed],Subscriber.prototype,"selectedDoc",null),__decorate([mobx.computed],Subscriber.prototype,"editing",null),__decorate([mobx.computed],Subscriber.prototype,"length",null),__decorate([mobx.computed],Subscriber.prototype,"filter",null),__decorate([mobx.computed],Subscriber.prototype,"paging",null),__decorate([mobx.action],Subscriber.prototype,"select",null),__decorate([mobx.action],Subscriber.prototype,"edit",null),module.exports=Subscriber;
