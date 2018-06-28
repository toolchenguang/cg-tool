/**
 *  带有事件处理的显示对象
 *  @param eventCycle 事件的生命周期
 *
 *  @author create by heshang
 * */
base.ControlEventBase = class extends base.ControlDisplayBase {
    constructor(eventCycle) {
        super(eventCycle);
        this._eventList = [];
        this._event = [];
        this._stop = false;//阻止冒泡
    }

    // noinspection JSAnnotator
    /**
     * 设置控件的点击事件
     * @param handler x
     * */
    set click(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CLICK, handler);
    }

    /**
     * 设置控件的点击事件
     * @param handler x
     * */
    set dblclick(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.DBLCLICK, handler);
    }

    // noinspection JSAnnotator
    /**
     * 设置控件的改变事件
     * @param handler x
     * */
    set change(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CHANGE, handler);
    }


    /**
     * 设置控件的右击事件
     * @param handler x
     * */
    set contextmenu(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CONTEXTMENU, handler);
    }

    /**
     * 设置控件的拖拽开始事件
     * @param handler x
     * */
    set dragbegin(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.DRAGBEGIN, handler);
    }

    /**
     * 设置控件的拖拽移动事件
     * @param handler x
     * */
    set dragmove(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.DRAGMOVE, handler);
    }

    /**
     * 设置控件的拖拽结束事件
     * @param handler x
     * */
    set dragend(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.DRAGEND, handler);
    }


    /**
     * 获取点击事件的句柄
     * @returns 事件句柄
     * */
    get click() {
        return this._event[base.EventBase.CLICK];
    }

    //获取事件索引
    getEvent(type, handler) {
        if (this._eventList[type]) {
            for (let i in this._eventList[type]) {
                let {call, caller, args} = this._eventList[type][i];
                if (handler.call == _call && handler.caller == _caller) {
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * 绑定事件类型 同种类型只能绑定一个事件
     * @param type 事件的类型
     * @param handler 事件句柄
     * */
    onEvent(type, handler) {
        this._event[type] = handler;
    }

    /**
     * 执行绑定类型的事件
     * @param type 绑定的事件类型
     * @param _args 执行时要传入的参数
     * */
    runEvent(type, _args) {

        if (this._event[type]) {
            if (this._stop) {
                this._stop = false;
                return;
            }
            let {call, caller, args} = this._event[type];
            call && call.call(caller, _args, args);
        }
    }

    /**
     * 删除绑定的事件类型
     * @param type 删除指定的事件类型
     * @example btn.offEvent(base.EventBase);
     * */
    offEvent(type) {
        delete this._event[type];
    }

    /**
     * 事件委托  同一个事件类型可以绑定多个不同的事件句柄
     * @param type 事件类型
     * @param handler 事件的对象
     * @example btn.on("abc",handler1);
     * @example btn.on("abc",handler2);
     * */
    on(type, handler) {
        let index = this.getEvent(type, handler);
        if (index != -1) {
            return;
        }
        if (!this._eventList[type]) {
            this._eventList[type] = [handler];
            return;
        }
        this._eventList[type].push(handler);
    }

    /**
     * 解绑 指定事件类型的 事件句柄
     * @param type 事件类型
     * @param handler 事件句柄
     * */
    off(type, handler) {
        let index = -1;
        if (this._eventList[type]) {
            for (let i in this._eventList[type]) {
                index = this.getEvent(type, handler);
                if (index != -1) {
                    break;
                }
            }
        }
        if (index >= 0) {
            delete this._eventList[type][index];
        }
    }

    /**
     * 绑定指定的事件类型，执行一次后自动解绑
     * @param type 事件类型
     * @param handler 事件句柄
     * */
    once(type, handler) {
        function one() {
            handler.call && handler.call(handler.caller, handler.args);
            this.off(type, handler);
        }

        this.on(type, one, this);
    }

    /**
     * 派发指定作用域下的事件
     * @param type 事件类型
     * @param _args 派发的时候传的第二个参数
     * @param _caller 派发时指定的作用域 不写默认派发全部
     * */
    dispatch(type, _args, _caller) {
        if (this._eventList[type]) {
            if (this._stop) {
                this._stop = false;
                return;
            }
            for (let i in this._eventList[type]) {
                let {call, caller, args} = this._eventList[type][i];
                if (!_caller || _caller == caller) {
                    call && call.call(caller, _args, args)
                }
            }
        }
    }

    // -------------事件委托结束

    destorySelfEvent() {

    }

    destorySelf() {
        this.destorySelfEvent();
        this.destorySelfProp();
    }

    /**
     * 销毁事件对象
     * */
    destory() {
        this._event = null;
        this._eventList = null;
        this.destorySelf();
        this.destoryDisplayBase();
    }

    /**
     * 根据dom节点把事件str反射到dom中
     * */
    createReflexEvent(str) {
        return base.Handler.create(function () {
            eval(str);
        }, this);
    }

    /**
     *反射控件的公共事件
     * @param child dom节点
     * @param reflex 反射对象
     * */
    reflexEvent(child, reflex) {
        let click = utils.Dom.getEvt(child, "click");
        let onload = utils.Dom.getEvt(child, "onload");
        let change = utils.Dom.getEvt(child, "change");
        if (click) {
            this.click = this.createReflexEvent(click);
        }
        if (onload) {
            reflex.ready(this.createReflexEvent(onload));
        }
        if (change) {
            this.change = this.createReflexEvent(change);
        }
        this.reflexEventDefault(child, reflex);
    }

    /**
     * 从dom中反射控件独有的事件，控件内需要有自己事件是需要重写
     * @param child dom的节点
     * @param reflex 反射的对象
     * */
    reflexEventDefault(child, reflex) {

    }

    reflexDom(child, reflex) {
        this.reflexProp(child, reflex);
        this.reflexEvent(child, reflex);
    }

    /**
     * 阻止冒泡
     * @example e.stop();
     * */
    stop() {
        if (this.parent && this.parent instanceof base.ControlEventBase) {
            this.parent.pstop();
        }
    }

    pstop() {
        this._stop = true;
        this.stop();
    }

    //--------阻止冒泡结束
}