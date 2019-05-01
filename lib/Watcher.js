import Dep from './Dep';

// 订阅者(Watcher)
class Watcher {
    // vue 实例，compile 中正则匹配结果(即需要订阅的数据)，compile 中执行渲染更新的回调
    constructor(vm, exp, cb) {
        this.vm = vm;
        this.exp = exp;
        this.cb = cb;
        this.val = this.get();
    }

    // 更新
    update() {
        const val = this.get();
        if (val !== this.val) {
            this.val = val;
            this.cb.call(this.vm, val);
        }
    }

    // 获取值的方法
    get() {
        Dep.target = this;

        let val = this.vm;
        let arr = this.exp.split('.');
        arr.forEach(key => val = val[key]);

        Dep.target = null;
        return val;
    }
}

export default Watcher;