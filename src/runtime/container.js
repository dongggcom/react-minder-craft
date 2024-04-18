/**
 * @fileOverview
 *
 * 初始化编辑器的容器
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define((require, exports, module) => {

    /**
     * 最先执行的 Runtime，初始化编辑器容器
     */
    function ContainerRuntime() {
        let container;

        if (typeof (this.selector) === 'string') {
            container = document.querySelector(this.selector);
        } else {
            container = this.selector;
        }

        if (!container) {throw new Error('Invalid selector: ' + this.selector);}

        // 这个类名用于给编辑器添加样式
        container.classList.add('km-editor');

        // 暴露容器给其他运行时使用
        this.container = container;
    }

    return module.exports = ContainerRuntime;
});
