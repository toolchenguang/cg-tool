/**
 *  基础的显示对象
 *  @param eventCycle 此按钮的生命周期对象
 *  @type null
 *  @author create by heshang
 * */
base.ControlDisplayBase = class extends base.EventPrope {
    constructor(eventCycle) {
        super();
        this._eventCycle = eventCycle;                               //生命周期
        this._childList = [];                                        //子对象的集合
        this._parent = null;                                         //父对象
        this.type = "";                                              //控件的类型
        this._styleCache = base.DomCacheRefresh.instance;
        //todo 目前这个做到了公用的里面 作者信息是拿不到的
        this.eventCycle.runEvent(base.EventBase.CREATE_BEFORE);           //对象创建完成
    }

    /**
     *设置控件内的公共属性
     * @param config 事件的配置
     * @example {text:"xxx",guid:"xxxx"}
     * */
    set config(config) {
        for (let i in config) {
            if (typeof this[i] != "undefined")
                this[i] = config[i];
            else {
                if (this.debugger) {
                    console.warn(this.type + ` prop${i} is not defined`);
                }
            }
        }
    }

    /**
     *获取此显示对象的生命周期
     * @returns 生命周期
     * */
    get eventCycle() {
        if (!this._eventCycle) {
            this._eventCycle = new base.EventCycle();
        }
        if (!this._eventCycle.parent) {
            this._eventCycle.parent = this;
        }
        return this._eventCycle;
    }

    /**
     *获取此显示对象的子对象
     * @returns 子对象集合列表
     * */
    get childList() {
        return this._childList;
    }


    /**
     *根据子对象索引获取子对象
     * @param index 子对象索引值
     * @returns 子对象
     * */
    getChildAt(index) {
        return this._childList[index];
    }

    /**
     *根据子对象id查找对象
     * @param guid 对象的唯一id
     * @returns 子对象
     * */
    getChildById(guid) {
        for (let i in this.childList) {
            if (this.childList[i].guid === guid) {
                return this.childList[i];
            }
        }
        return null;
    }

    /**
     * 将属性反射到对象上
     * @param child 节点对象
     * @param reflex 反射对象
     * */
    reflexProp(child, reflex) {
        let guid = utils.Dom.getAttr(child, "guid");
        let text = utils.Dom.getAttr(child, "text");
        let config = utils.Dom.getAttr(child, "config");
        if (guid) {
            this.guid = guid;
        } else {
            this.guid = this.guid;
        }
        if (text) {
            // if(text.indexOf('.')>-1){
            //     text = text.split('.');
            //     text[0]="i";
            //     let str=""
            //     str = `${text[0]}.${text[1]}`;
            //     text=i? str: '';
            //     this.text = eval(text);
            // } else {
            this.text = text;
            // }

        }
        if (config) {
            this.config = eval(config);
        }
        this.reflexPropSelf(child, reflex);
    }

    /**
     * 从dom中反射控件独有的属性，控件内需要有自己的反射属性是需要重写
     * @param child dom的节点
     * @param reflex 反射的对象
     * */
    reflexPropSelf(child, reflex) {

    }

    reflexDom(child, reflex) {
        this.reflexProp(child, reflex);
    }

    get dom() {
        return null;
    }

    /**
     * 获取此对象的父对象
     * */
    get parent() {
        return this._parent;
    }

    /**
     * 添加对象作为此对象的子对象
     *  @param node 子对象必须是一个显示对象
     * */
    addChild(node) {
        this.eventCycle.runEvent(base.EventBase.LOAD_BEFORE);
        node._parent = this;
        this._childList.push(node);
        if (node.dom && this.dom) {
            this.dom.appendChild(node.dom);
        }
        node.setControllerItem(node.guid, node.guid);
        this.eventCycle.runEvent(base.EventBase.LOAD_COMPLETE);
    }

    /**
     * 删除此对象的所有子对象
     * */
    removeAllChild() {
        for (let i in this._childList) {
            this._childList[i].destory();
        }
        this._childList = null;
    }

    /**
     * 删除此对象本身的渲染逻辑，物理逻辑还存在可以再次添加
     * */
    removeSelfUI() {
        if (this.parent) {
            this.parent.dom.removeChild(this.dom);
        }
    }

    /**
     * 销毁显示对象内的所有UI、及生命周期
     * */
    destoryDisplayBase() {
        this.eventCycle.runEvent(base.EventBase.DESTORY_BEFORE);
        this.removeAllChild();
        this.removeSelfUI();
        this._parent = null;
        this.eventCycle.runEvent(base.EventBase.DESTORY_COMPLETE);
        this._eventCycle = null;
    }

    /**
     * 销毁自身所有的额外的事件跟变量
     * */
    destorySelfProp() {

    }

    destorySelf() {
        this.destorySelfProp();
    }

    /**
     * 销毁对象
     * */
    destory() {
        this.destorySelf();
        this.destoryDisplayBase();
    }

    //加载完成
    loadComplete() {
        this.eventCycle.runEvent(base.EventBase.LOAD_COMPLETE);
    }

    /**
     * 设置属性 改变dom
     * @param key 属性名称 || 是一个哈希列表
     * @param val 属性名称对应的值
     * @example a.style({"position":"absolute","margin-top":"0px"})
     * @example a.style("position","absolute");
     * */
    style(key, val) {
        this._styleCache.addStyle(this, key, val);
    }

    /**
     * 元素的visibility属性
     * @param v visible默认，元素框是可见的。 hidden元素框不可见，但仍然影响布局。 collapse当在表格元素中使用时，此值可删除一行或一列，但是它不会影响表格的布局。被行或列占据的空间会留给其他内容使用。如果此值被用在其他的元素上，会呈现为 "hidden"。
     * @example a.visibility = "visible";
     * */
    set visibility(v) {
        this.style("visibility", v);
        this._visibility = v;
    }

    get visibility() {
        return this._visibility;
    }

    /**
     * 设置元素的zindex
     * @param z 显示的层级
     * */
    set zindex(z) {
        this.style("zIndex", z);
        this._zindex = z;
    }

    get zindex() {
        return this._zindex;
    }


    set width(w) {
        this.style("width", w);
        this._width = w;
    }

    get width() {
        return this._width;
    }


    //设置属性 改变dom  end

}
