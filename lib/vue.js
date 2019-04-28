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
}

// 1. 监听数据
function observe(value) {
    // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听（简单能力判断）
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}
// 监听者，监听对象属性值的变化
class Observer {
    constructor(value) {
        this.value = value;
        this.walk(value);
    }
    // 遍历所有可枚举属性值并监听
    walk(value) {
        Object.keys(value)
            .forEach(key => this.convert(key, value[key]));
    }
    // 执行监听的具体方法
    convert(key, val) {
        defineReactive(this.value, key, val);
    }
}

// 定义响应
function defineReactive(obj, key, val) {
    // 1.4 深度遍历添加监听
    observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // 可配置
        get: () => { // 1.1 定义 getter 读访问操作符
            return val;
        },
        set: newVal => { // 1.1 定义 setter 写访问操作符
            // 1.2 值不变则不需要任何操作
            if (val === newVal) return;
            // 1.3 值改变以后，getter 获取的值应该是新值
            val = newVal;
            // 1.5 对新值进行监听
            observe(newVal);
        },
    });
}

