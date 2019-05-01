// 订阅发布中心，即消息管理员（Dep）
// 它负责储存订阅者和消息的分发，不管是订阅者还是发布者都需要依赖于它
class Dep {
    constructor() {
        // 储存订阅者的数组
        this.subs = [];
    }

    // 添加订阅者 subscribe
    addSub(sub) {
        this.subs.push(sub);
    }

    // 通知更新，注意：约定所有的订阅者实例都有一个 update 方法，用于同一进行更新
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}

// 静态属性，默认为 null，工作时指向当前的 Watcher
Dep.target = null;

export default Dep;