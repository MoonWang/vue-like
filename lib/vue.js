import observe from './observe';
import Compile from './compile';
class Vue {
    constructor(options = {}) {
        // 所有属性挂载在 $options（简化版）
        this.$options = options;
        // 数据可以通过 this._data 获取（简化版）
        let data = (this._data = this.$options.data);

        // 优化功能：将所有 data 最外层属性代理到 Vue 实例上，方便直接 this. 调用
        Object.keys(data)
            .forEach(key => this._proxy(key));

        // 初始化，监听数据
        observe(data);

        // 要在模板解析之前初始化，否则无法收集依赖

        this.initComputed();
        // 模板解析
        new Compile(this.$options.el, this);
    }
    // 将 data 代理到 Vue 实例上
    _proxy(key) {
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => this._data[key], // 注意：看上去访问的是 this[x]，但实际上数据在 this._data 上
            set: val => {
                // 注意：更改的时候，不能直接修改 this[x] ，而应该是 this._data[x]
                this._data[key] = val;
            },
        });
    }

    // 计算属性初始化
    initComputed() {
        let computed = this.$options.computed;
        let vm = this;
        Object.keys(computed).forEach(key => {
            Object.defineProperty(vm, key, {
                // 如果是函数则定义的是 getter ，如果是对应则定义的包含 get 定义
                get: typeof computed[key] === 'function' ? computed[key] : computed[key].get
            })
        })
    }
}

export default Vue;

window.Vue = Vue;