/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/vue.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/compile.js":
/*!************************!*\
  !*** ./lib/compile.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// 2. 编译模板\nclass Compile {\n    constructor(el, vm) {\n        vm.$el = document.querySelector(el);\n        this.vm = vm;\n        this.render();\n    }\n\n    render() {\n        // 为了提高渲染效率，使用文本片段进行批量操作\n        let fragment = document.createDocumentFragment();\n        let child;\n        while(child = this.vm.$el.firstChild) {\n            fragment.appendChild(child);\n        }\n\n        // 处理过程：将 {{x}} 格式的占位替换成数据\n        this.replace(fragment);\n\n        // 处理完后再插回 DOM 中\n        this.vm.$el.appendChild(fragment);\n    }\n\n    replace(father) {\n        Array.from(father.childNodes).forEach(node => {\n            let text = node.textContent;\n            let reg = /\\{\\{(.*)\\}\\}/;\n\n            // 只处理文本节点类型\n            if(node.nodeType === 3 && reg.test(text)) {\n                // RegExp.$1 获取当前匹配的第一个子表达式，$1 静态属性非标准的，仅限学习时使用\n                let arr = RegExp.$1.split('.');\n                // 遍历一直向后取key\n                let val = this.vm;\n                arr.forEach(key => val = val[key]);\n                node.textContent = text.replace(reg, val);\n            }\n\n            // 递归处理子节点\n            if(node.childNodes) {\n                this.replace(node);\n            }\n        })\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Compile);\n\n//# sourceURL=webpack:///./lib/compile.js?");

/***/ }),

/***/ "./lib/observe.js":
/*!************************!*\
  !*** ./lib/observe.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// 监听者(Observer)，用于监听属性值的变化，也可以叫发布者\n\n// 1. 监听数据\nfunction observe(value) {\n    // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听（简单能力判断，防报错）\n    if (!value || typeof value !== 'object') {\n        return;\n    }\n    return new Observer(value);\n}\n// 监听者，监听对象属性值的变化\nclass Observer {\n    constructor(value) {\n        this.value = value;\n        this.walk(value);\n    }\n    // 遍历所有可枚举属性值并监听\n    walk(value) {\n        Object.keys(value)\n            .forEach(key => this.convert(key, value[key]));\n    }\n    // 执行监听的具体方法\n    convert(key, val) {\n        defineReactive(this.value, key, val);\n    }\n}\n\n// 定义响应\nfunction defineReactive(obj, key, val) {\n    // 1.4 深度遍历添加监听\n    observe(val);\n    Object.defineProperty(obj, key, {\n        enumerable: true, // 可枚举\n        configurable: true, // 可配置\n        get: () => { // 1.1 定义 getter 读访问操作符\n            return val;\n        },\n        set: newVal => { // 1.1 定义 setter 写访问操作符\n            // 1.2 值不变则不需要任何操作\n            if (val === newVal) return;\n            // 1.3 值改变以后，getter 获取的值应该是新值\n            val = newVal;\n            // 1.5 对新值进行监听\n            observe(newVal);\n        },\n    });\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (observe);\n\n//# sourceURL=webpack:///./lib/observe.js?");

/***/ }),

/***/ "./lib/vue.js":
/*!********************!*\
  !*** ./lib/vue.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _observe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observe */ \"./lib/observe.js\");\n/* harmony import */ var _compile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compile */ \"./lib/compile.js\");\n\n\nclass Vue {\n    constructor(options = {}) {\n        // 所有属性挂载在 $options（简化版）\n        this.$options = options;\n        // 数据可以通过 this._data 获取（简化版）\n        let data = (this._data = this.$options.data);\n\n        // 优化功能：将所有 data 最外层属性代理到 Vue 实例上，方便直接 this. 调用\n        Object.keys(data)\n            .forEach(key => this._proxy(key));\n\n        // 初始化，监听数据\n        Object(_observe__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(data);\n\n        // 模板解析\n        new _compile__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.$options.el, this);\n    }\n    // 将 data 代理到 Vue 实例上\n    _proxy(key) {\n        Object.defineProperty(this, key, {\n            configurable: true,\n            enumerable: true,\n            get: () => this._data[key], // 注意：看上去访问的是 this[x]，但实际上数据在 this._data 上\n            set: val => {\n                // 注意：更改的时候，不能直接修改 this[x] ，而应该是 this._data[x]\n                this._data[key] = val;\n            },\n        });\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Vue);\n\nwindow.Vue = Vue;\n\n//# sourceURL=webpack:///./lib/vue.js?");

/***/ })

/******/ });