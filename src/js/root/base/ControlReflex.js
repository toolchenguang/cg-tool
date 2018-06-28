/**
 * 事件反射 将dom中的所有元素反射到框架中
 * @author create by heshang
 * */

base.ControlReflex = class {
    constructor() {
        this.debugger = false;
        this.call = null;
        this.caller = null;
        this.window = window ? window : {};
        this.document = this.window.document ? this.window.document : {};
        this.box = null;
        this._readyList = [];
        //todo document.onreadystatechange || docuemtn.ready
        let ie = !(this.window.attachEvent && !this.window.opera);
        if (!ie) {
            if (this.document.onreadystatechange) {
                this.document.onreadystatechange = (e) => {
                    if (document.readyState === "interactive") {
                        this.init();
                    }
                }
            } else {
                this.document.ready = function () {
                    this.init();
                }.bind(this);
            }
        } else {
            this.document.addEventListener('DOMContentLoaded', () => {
                this.init();
            }, false);
        }

    }

    /**
     *  框架的入口函数
     *  @param handler 页面准备完毕的句柄，可以放置多个。
     * */
    ready(handler) {
        this._readyList.push(handler);
    }

    /**
     * 反射初始化
     * */
    init() {
        let box = new control.Box();
        let body = document.body.cloneNode(true);
        this.document.body.innerHTML = "";
        let dom = body.children;
        for (let i = 0; i < dom.length; i++) {
            this.build(dom[i], box);
        }
        this.box = box;
        this.document.body.appendChild(box.dom);
        this.runReadyList();
    }

    /**
     *  执行入口函数的监听
     * */
    runReadyList() {
        for (let i in this._readyList) {
            let {call, caller, args} = this._readyList[i];
            // this.call && this.call.call(this.caller, box);
            call.call(caller, this.box, args);
        }
        this._readyList = null;
    }

    startBuild() {

    }

    /**
     * @param child 重铸dom对象
     * */
    build(child, controlObj) {
        if (child.nodeName === "SCRIPT") {
            return;
        }
        let t = this.createControlAtt(child, controlObj);
        this.buildChildren(child.children, t);
    }

    buildChildren(children, t) {
        if (children.length <= 0) {
            return;
        }
        for (let i = 0; i < children.length; i++) {
            this.build(children[i], t);
        }
    }

    checkReflex(nodeName) {
        if (nodeName.indexOf("data-") > -1) {
            return true;
        }
        if (nodeName.indexOf("evt-") > -1) {
            return true;
        }
        return false;
    }

    /**
     *  @param child 子节点对象
     *  @param controlObj 控制逻辑对象
     * */
    createControlAtt(_child, controlObj) {
        let child = _child.cloneNode(false);
        let t = this.makeControl(child);
        for (let i = 0; i < child.attributes.length; i++) {
            let nodeName = utils.Dom.getAttrNodeName(child.attributes[i]);
            let val = utils.Dom.getAttrValue(child.attributes[i]);
            if (!this.checkReflex(nodeName) || this.debugger)
                t.dom.setAttribute(nodeName, val);
        }
        // if (t) {

        t.reflexDom(child, this);

        controlObj.addChild(t);
        // }
        return t;
    }

    /**
     * 根据自定义创建基于结构的对象
     * */
    makeControl(child) {
        try {
            let type = utils.Dom.getAttr(child, "control-type");
            if (!type) {
                return new control.Base(child);
            }
            let a = eval("new " + type + "()");
            return a;
        } catch (e) {
            // let error = new Error("xx");
            let error = new Error("reflex dom is Error：" + `${utils.Dom.getOuterHtml(child)}`);
            error.stack = e.stack;
            // console.error(error);
            throw error;
        }
    }
}
base.reflex = new base.ControlReflex();