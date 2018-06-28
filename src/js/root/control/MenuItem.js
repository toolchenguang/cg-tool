control.MenuItem = class extends control.Base {
    /**
     * 菜单项的构造方法
     * @param label 当前的标签
     * @param subItems 当前菜单的子项集合
     * @param clickFunc 当前菜单单机触发的事件
     * @param type 当前菜单的类型
     * @param accelerator 当前菜单的快捷键
     * @param icon 当前菜单的图标
     * @param enable 当前菜单是否可用
     * @param eventCycle 当前菜单的周期状态
     * @example <menuItem data-control-type="control.MenuItem" data-label="标准型(T)" data-index="1" data-type="normal" data-accelerator="Alt+1"></menuItem>
     * @author created by lingyan
     */
    constructor(label, index, subItems, clickFunc, type, accelerator, icon, enable = true, eventCycle) {
        super(eventCycle);
        this.name = "MenuItem"; // 控件的名称
        this.version = "1.0.0"; // 控件的版本
        this.author = "lingyan"; // 控件的制作人
        this._label = label; // 获取当前标签的内容
        this._index = index ? index : 1; // 获取当前标签的索引，0代表第一级标签，非0代表非一级标签
        this._childList = subItems ? subItems : []; // 当前菜单的子菜单，这时候子菜单已经初始化完成了
        this._accelerator = accelerator; // 当前菜单的快捷键
        this._icon = icon; // 当前菜单需要展示的图标
        this._enable = enable ? enable : false; // 当前菜单是否可用
        this._type = type ? type : control.Menu.MeunItemType.NORMAL; // 当前菜单的类型，是app菜单还是右键菜单
        this._showItem = false; // 默认不显示子菜单
        this._getFocused = false; // 当前菜单是否处于获取焦点状态，如果处于获取焦点状态，只要经过菜单项就会显示子菜单，否则不显示，点击子菜单获取焦点，再次点击失去焦点，点击非菜单区域失去焦点
        this._clickFunc = clickFunc;
        this._getHtml();
    }
    /**
     * 获取当前的html
     * @private
     */
    _getHtml() {

        switch (this._type) {
            //分隔线
            case control.Menu.MeunItemType.SEPARATOR:
                this._currentDom = $(`<li class="separator-menuItem"></li>`);
                break;
            //当是正常菜单项的时候 也分两种 一种是初级菜单项 横向显示，另一种是非初级菜单项，纵向显示
            case control.Menu.MeunItemType.NORMAL:
                // 第一组子项，横向显示
                if (this._index == 0) {
                    this._currentDom = $(`<li class="normal-menuItem-first"><span>${this.label}</span></li>`);
                    this._subDom = $(`<ul class="normal-menu-first"></ul>`);
                }
                else {
                    this._currentDom = $(`<li class="normal-menuItem"></li>`);
                    this._initStyle(3);
                    this._subDom = $(`<ul class="normal-menu"></ul>`);
                }
                break;
            default:
                break;
        }
        //如果该菜单项包含子菜单，默认是隐藏的
        if (this._subDom) {
            this.showItem?this._subDom.show():this._subDom.hide();
            this._currentDom.append(this._subDom);
        }
        this._html = this._currentDom;
        this._bindEvent();

        // 初始化鼠标点击事件
        this.clickFunc = ()=>
        {
            if(this.index==0){
                this._getFocused = !this._getFocused;
            }
            if (this._clickFunc) {
                this._clickFunc;
            }
            this.showItem = !this._showItem;
        }
        this._currentDom.on("click", () => {
                this.clickFunc();
        });
    }

    /**
     * 根据不同的菜单选项类型初始化样式，可以考虑部分样式的设置是否可以通过属性来设置
     * @param index:代表了当前菜单选项的类型，1表示分隔线，2表示一级菜单项，3代表非一级菜单
     */
    _initStyle(index) {
        switch (index) {
            case 3:
                //如果存在图标，将图标添加到html中
                if (this.icon) {
                    let iconDom = $(`<img src="${this.icon}"/>`);
                    this._currentDom.append(iconDom);
                }
                //添加标签
                this._currentDom.append($(`<span class="normal-menuItem-label" style="left: ${this._hasReadyIcon?'40px':'10px'}">${this.label}</span>`));
                //如果存在快捷键
                if (this._accelerator) {
                    this._acceleratorDom = $(`<span class="normal-menuItem-accelerator">${this._accelerator}</span>`);
                    // 这个时候该菜单的宽度还没有确定，只有初始化父菜单的时候子菜单的宽度才能确定，所以这里的快捷键的位置
                    // 需要在设置宽度的时候设置
                    this._currentDom.append(this._acceleratorDom);
                }
                // 如果存在子菜单列表 应该绘制向右的箭头
                if (this._childList && this._childList.length > 0) {
                    this._rightDom = $(`<span class="normal-menuItem-right" style="vertical-align: middle;"></span>`);
                    this._currentDom.append(this._rightDom);
                }
                break;
        }
    }


    /**
     * @private 绑定事件
     */
    _bindEvent() {
        // 鼠标进图的状态分为两种，一种是初级菜单，另一种是非初级菜单，非初级菜单 鼠标进入除了样式的改变还要显示子菜单项。
        // 初级菜单当获取焦点的时候显示子菜单项，否则不显示
        this._currentDom.on("mouseenter", () => {
            if ((this.index == 0 && this.getFocused) || (this.index > 0)) {
                this.showItem = true;
            }
        });
        this._currentDom.on("mouseleave", () => {
            this.showItem = false;
        });
    }

    /**
     * 由于控件特殊性，重写addChild方法
     * @param node
     */
    addChild(node){
        this.eventCycle.runEvent(base.EventBase.LOAD_BEFORE);
        // 如果还没有确定子菜单项包含图标 并且当前子菜单包含图标的话 遍历之前的所有子菜单，重新设置hasReadyIcon属性
        if(!this._subHasIcon && node.icon){
            for(let subNode in this._childList){
                this._childList[subNode].hasReadyIcon = true;
            }
            this._subHasIcon = true;
        }
        node._parent = this;
        this._childList.push(node);
        // 如果确定子菜单包含图标，没个添加的子项需要重新设置hasReadyIcon属性
        if(this._subHasIcon){
            node.hasReadyIcon = true;
        }
        if (node.dom && this._subDom && this.type != control.Menu.MeunItemType.SEPARATOR) {
            this._subDom.append(node.dom);
            this._subDom.css("width", this.maxWidth + "px");
        }
        // 判断是否添加右键菜单
        if(this.index>0 && this._childList && !this._rightDom){
            this._rightDom = $(`<span class="normal-menuItem-right" style="vertical-align: middle;"></span>`);
            this._currentDom.append(this._rightDom);
        }
        node.setControllerItem(node.guid, node.guid);
        this.eventCycle.runEvent(base.EventBase.LOAD_COMPLETE);
    }

    get getFocused(){
        return this._getFocused;
    }

    /**
     * 获取当前列表菜单是否显示
     * @returns {boolean|*}
     */
    get showItem() {
        return this._showItem;
    }

    /**
     * 设置当前列表菜单是否显示
     * @param b
     */
    set showItem(b) {
        //如果是一级菜单 只能显示一个子菜单
        if(b && this._index ===0){
            for(let item of this._parent.childList){
                item.showItem = false;
            }
        }
        this._showItem = b;
        if (this._subDom) {
            this._showItem ? this._subDom.show() : this._subDom.hide();
        }
    }
    /**
     * 获取当前菜单的标签
     * @returns {*}
     */
    get index() {
        return this._index;
    }

    /**
     * 设置当前菜单的标签
     * @param str
     */
    set index(index) {
        this._index = index;
    }

    /**
     * 获取当前菜单的标签
     * @returns {*}
     */
    get label() {
        return this._label;
    }

    /**
     * 设置当前菜单的标签
     * @param str
     */
    set label(str) {
        this._label = str;
    }

    /**
     * 设置当前的子项菜单列表
     * @param items
     */
    set childList(items) {
        this._childList = items;
        if(!items || items.length<=0){
            return;
        }
        for(let item of items){
            item._parent = this;
        }
    }
    get childList(){
        return this._childList;
    }

    /**
     * 获取当菜单项被点击后的回调方法
     * @returns {*}
     */
    get clickFunc() {
        return this._clickFunc;
    }

    /**
     * 设置菜单项被点击后的回调方法
     * @param f
     */
    set clickFunc(f) {
        this._clickFunc = f;
    }

    /**
     * 获取当前菜单项的类型，目前只有三种类型，normal，submenu, separator
     * @returns {*}
     */
    get type() {
        return this._type;
    }

    /**
     * 设置当前菜单项的类型
     * @param t
     */
    set type(t) {
        this._type = t;
    }


    /**
     * 获取当前菜单的快捷键
     * @returns {*}
     */
    get accelerator() {
        return this._accelerator;
    }

    /**
     * 设置当前菜单的快捷键
     * @param commandKey
     */
    set accelerator(commandKey) {
        this._accelerator = commandKey;
    }

    /**
     * 获取当前菜单的图标
     * @returns {*}
     */
    get icon(){
        return this._icon;
    }

    /**
     * 设置当前菜单的图标
     * @param i
     */
    set icon(i){
        this._icon = i;
    }

    /**
     * 设置是否预留图标的位置
     * @param i
     */
    set hasReadyIcon(i){
        this._hasReadyIcon = i;
        this._html[0].getElementsByClassName("normal-menuItem-label")[0].style.left = this._hasReadyIcon?"40px":"10px";
    }

    /**
     * 获取当前菜单是否可用
     * @returns {*}
     */
    get enable(){
        return this._enable;
    }

    /**
     * 设置当前菜单是否可用
     * @param e
     */
    set enable(e){
        this._enable = e;
        this._html[0].style.enable = this._enable;
    }

    /**
     * 根据子项获取当前子菜单的宽度
     * @returns {number}
     */
    get maxWidth(){
        if(!this._childList || this._childList.length<=0){
            return 0;
        }
        let max = 0;
        for(let index = 0;index<this._childList.length;index++){
            let contentWidth = this._childList[index].label?this._childList[index].label.length * 15:0;
            let iconWidth = this._childList[index].icon?30:0;
            let acceleratorWidth = this._childList[index].accelerator?this._childList[index].accelerator.length * 10:0;
            let leftWidth = 50;
            let temp = contentWidth + iconWidth + acceleratorWidth + leftWidth;
            if(temp>max){
                max = temp;
            }
        }
        for(let index = 0;index<this._childList.length;index++) {
            this._childList[index].width = max;
        }
        return max;
    }

    /**
     * 获取当前菜单项的宽度
     * @returns {*|null}
     */
    get width(){
        return this._width;
    }

    /**
     * 根据当前项的宽度设置样式
     * @param w
     */
    set width(w){
        this._width = w;
        if(this._index!=0 && this._subDom){
            this._subDom.css("left", (this.width-40) + "px");
        }
        if(this._index !=0 && this._accelerator){
            this._acceleratorDom.css("left",(this.width - this._accelerator.length * 10-15) + "px");
        }
    }

    /**
     * 获取dam树
     * @returns {dam树}
     */
    get dom(){
        return this._html[0];
    }

    /**
     * 删除自身的属性
     * */
    destorySelfProp() {
        this._text = null;
        this._width = null;
        this._enable = null;
        this._icon = null;
        this._accelerator = null;
        this._type = null;
        this._clickFunc = null;
        this._childList = null;
        this._label = null;
        this._showItem = null;

    }

    /**
     *删除自身的事件
     * */
    destorySelfEvent() {
        this._currentDom.off("click");
        this._currentDom.off("mouseenter");
        this._currentDom.off("mouseleave");
    }

    /**
     * reflex自己的属性
     * @param child
     * @param reflex
     */
    reflexPropSelf(child, reflex){
        let label = utils.Dom.getAttr(child, "label");
        let index = utils.Dom.getAttr(child, "index");
        let accelerator = utils.Dom.getAttr(child, "accelerator");
        let icon = utils.Dom.getAttr(child, "icon");
        let enable = utils.Dom.getAttr(child, "enable");
        let type = utils.Dom.getAttr(child, "type");
        let showItem = utils.Dom.getAttr(child, "showItem");
        if (label) {
            this.label = label;
        }if (index) {
            this.index = index;
        }if (accelerator) {
            this.accelerator = accelerator;
        }if (icon) {
            this.icon = icon;
        }if (enable) {
            this.enable = enable;
        }if (type) {
            this.type = type;
        }
        if(showItem == "true"){
            this.showItem = showItem;
        }
        this._getHtml();
    }

    /**
     * reflex默认的事件
     * @param child
     * @param reflex
     */
    reflexEventDefault(child, reflex) {
        let click = utils.Dom.getEvt(child, "click");
        if (click) {
            this.clickFunc= () => {
                if(this.index==0){
                    this._getFocused = !this._getFocused;
                }
                this.runEvent(base.EventBase.CLICK);
                this.showItem = !this._showItem;
            };
            this._currentDom.on("click", () => {
                this.clickFunc();
            });
        }
    }
}
