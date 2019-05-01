import Watcher from './Watcher';

// 2. 编译模板
class Compile {
    constructor(el, vm) {
        vm.$el = document.querySelector(el);
        this.vm = vm;
        this.render();
    }

    render() {
        // 为了提高渲染效率，使用文本片段进行批量操作
        let fragment = document.createDocumentFragment();
        let child;
        while(child = this.vm.$el.firstChild) {
            fragment.appendChild(child);
        }

        // 处理过程：将 {{x}} 格式的占位替换成数据
        this.replace(fragment);

        // 处理完后再插回 DOM 中
        this.vm.$el.appendChild(fragment);
    }

    replace(father) {
        Array.from(father.childNodes).forEach(node => {
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;

            // 只处理文本节点类型
            if(node.nodeType === 3 && reg.test(text)) {
                // RegExp.$1 获取当前匹配的第一个子表达式，$1 静态属性非标准的，仅限学习时使用
                let arr = RegExp.$1.split('.');
                // 遍历一直向后取key
                let val = this.vm;
                arr.forEach(key => val = val[key]);
                node.textContent = text.replace(reg, val);

                // 创建订阅者实例，用于后续数据更新时的重新渲染
                new Watcher(this. vm, RegExp.$1, newVal => {
                    node.textContent = text.replace(reg, newVal);
                })
            }

            // v-model 双向数据绑定
            if(node.nodeType === 1) {
                let nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => {
                    let name = attr.name;
                    if(name == 'v-model') {
                        let exp = attr.value;
                        // 初始化赋值
                        node.value = this.vm[exp];

                        // 添加监听
                        new Watcher(this.vm, exp, newVal => {
                            node.value = newVal;
                        });

                        // 添加输入处理
                        node.addEventListener('input', e => {
                            this.vm[exp] = e.target.value;
                        })
                    }
                })
            }

            // 递归处理子节点
            if(node.childNodes) {
                this.replace(node);
            }
        })
    }
}

export default Compile;