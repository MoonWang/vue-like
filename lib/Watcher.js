// 订阅者(Watcher)
class Watcher {
    constructor(cb) {
        this.cb = cb;
    }

    // 更新
    update() {
        this.cb();
    }
}