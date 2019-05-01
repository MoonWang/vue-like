import Dep from './Dep';
// 监听者(Observer)，用于监听属性值的变化，也可以叫发布者

// 1. 监听数据
function observe(value) {
    // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听（简单能力判断，防报错）
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
    let dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // 可配置
        get: () => { // 1.1 定义 getter 读访问操作符
            // 收集依赖
            Dep.target && dep.addSub(Dep.target);
            return val;
        },
        set: newVal => { // 1.1 定义 setter 写访问操作符
            // 1.2 值不变则不需要任何操作
            if (val === newVal) return;
            // 1.3 值改变以后，getter 获取的值应该是新值
            val = newVal;
            // 1.5 对新值进行监听
            observe(newVal);
            // 通知更新
            dep.notify();
        },
    });
}

export default observe;