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
            }

            // 递归处理子节点
            if(node.childNodes) {
                this.replace(node);
            }
        })
    }
}

export default Compile;