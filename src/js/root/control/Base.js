/**
 *  基础的dom结构 把未定义的节点原样构建到本身的dom树中
 *  @param Node 需要遍历的节点
 *  @author create by heshang
 * */
control.Base = class extends base.ControlEventBase {
    constructor(Node, eventCycle) {
        super(eventCycle);
        this.name = "Base";
        this.version = "1.0.0";//控件的版本
        this.author = "heshang";//控件的制作人
        this._value = null;
        if (Node) {
            this._html = $(Node.cloneNode(true));
            this.dom.setAttribute("data-guid", this.guid);
        } else {
            this._html = "";
        }
    }

    /**
     *  获取本类的js对象
     * */
    get dom() {
        if (this.html) {
            return this.html[0];
        } else {
            return "";
        }
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
    }

}