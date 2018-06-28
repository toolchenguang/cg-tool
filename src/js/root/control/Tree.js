/**
 * 主树控件
 * @param eventCycle 事件生命周期
 * @author create by taiduo
 * */
control.Tree = class extends control.Base {
    constructor(eventCycle,styles = null,className = '') {
        super(eventCycle);
        this.name = "Tree";
        this.version = "1.0.0" //控件的版本
        this.author = "taiduo"; //控件的制作人
        //根节点
        this._rootNode = null;
        //保存当前点击tree
        this._selectItem = null;
        //保存上一个点击tree
        this._selectPrevItem = null;
        //点击事件保存的tree
        this._selectClickItem = null;
        //绑定html
        this._html = $(`<div  class="controlTree ${className}"></div>`);
        if(styles){

            this._html[0].style.cssText = styles;
        }
        //tree事件
        this._bindEvent();
    }
    set selectItem(item){
    	this._selectItem = item;
    }

    get selectItem(){
    	return this._selectItem;
    }

    set selectPrevItem(item){
        this._selectPrevItem = item;
    }
    get selectPrevItem(){
        return this._selectPrevItem;
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
        node._rootNode = this;
        this._findRootNode(node);
        this.eventCycle.runEvent(base.EventBase.LOAD_COMPLETE);
    }

    _findRootNode(node) {
        if (node._childList.length) {
            for (let i in node._childList) {
                node._childList[i]._rootNode = node._rootNode;
                if(node._childList[i]._childList.length){
                    node._rootNode._findRootNode(node._childList[i]);
                }
            }
        }
    }

    reflexPropSelf(child, reflex){
        let className = utils.Dom.getAttr(child, "className");
        let styles = utils.Dom.getAttr(child, "styles");
        if(className){this._html.addClass(className);}
       
        if(styles){
            this._html[0].style.cssText = styles
        }
    }
    //绑定事件
    _bindEvent() {
        //绑定html单击事件
        this.html.on("click", function(ev) {
            if (this._stopEvent(ev)) return;
            // control.Tree.initTargetNd(ev, this,'click');
            this.runEvent(base.EventBase.CLICK, this);
        }.bind(this));

        //绑定html双击事件
        this.html.on("dblclick", function(ev) {
            if (this._stopEvent(ev)) return;
            // control.Tree.initTargetNd(ev, this,'dblclick');
            this.runEvent(base.EventBase.DBLCLICK, this);
        }.bind(this));

        //绑定右击事件
        this.html.on("contextmenu", function(ev) {
            if (this._stopEvent(ev)) return;
            // control.Tree.initTargetNd(ev, this,'contextmenu');
            this.runEvent(base.EventBase.CONTEXTMENU, this);
            window.event.returnValue=false;  
            return false;  
        }.bind(this))

        //绑定拖拽事件
        let _cur = this;
        this.html.on("mousedown", function(ev) {
            if (this._stopEvent(ev)) return;
            // control.Tree.initTargetNd(ev, _cur,'mousedown');
            _cur.runEvent(base.EventBase.DRAGBEGIN, _cur);
            //移动开始
            document.onmousemove = function(event) {
                _cur.runEvent(base.EventBase.DRAGMOVE, _cur);
            }
            //移动停止
            document.onmouseup = function() {
                _cur.runEvent(base.EventBase.DRAGEND, _cur);
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }.bind(this));

    }

    //初始化事件触发节点
    static initTargetNd(ev, cur,eventType) {
        let currentTreeItem = window.currentTreeItem || null;
        if(eventType == "click"){
        	 if(cur._selectClickItem){
        		 cur.selectPrevItem = cur._selectClickItem;
       		 }
       		 cur._selectClickItem = currentTreeItem;
        }else{
        	cur.selectItem = currentTreeItem;
        }
    }

    //阻止冒泡
    _stopEvent(ev) {
        let _ev = ev || window.event;
        let _target = _ev.target || _ev.srcElement;
        if (ev.target.className.indexOf('spreadList') != -1) return 1;
    }


    //销毁事件
    destroySelfEvent(){
        this._html.off("click");
        this._html.off("dblclick");
        this._html.off("contextmenu");
        this._html.off("mousedown");
    }

    //销毁属性
    destroySelfProp(){
        this._selectItem = null;
        this._selectClickItem = null;
        this._html = null;
    }
    //返回DOM
    get dom() {
        let _nd = "";
        if (this.html) {
            _nd = this.html[0];
        }
        return _nd;
    }
}