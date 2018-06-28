control.ImgButton = class extends control.Base {
    constructor(normorl='',over='',down='',text="",ev) {
        super(ev);
        this.name = "ImgButton";    //控件的名称
        this.version = "1.0.0";  //控件的版本
        this.author = "fengche"; //控件的制作人
        this._text = text; //控间文本
        this._normorl = normorl;//控间默认背景图显示
        this._over = over;//控间划过背景图显示
        this._down = down;//控间鼠标落下背景图显示
        this._bgSrc = normorl;//控间默认的背景图
        this._align = 'left'//控间文本位置  接收所有text-align属性值
        this._vertical = 'top'//控间文本位置  接收所有text-vertical属性值
        this._divDom = $(`<div style="position:absolute">${this._text}</div>`)
        let html = $(`<button class="button" data-guid="${this.guid}" style="position: relative; border: null; padding:0; margin: 0;"></button>`);
        html.append(this._divDom);
        this._html = html;
        this._bindEvent();
    }

    reflexPropSelf(child, reflex) {
        let normorl = utils.Dom.getAttr(child, "normorl");
        let over = utils.Dom.getAttr(child, "over");
        let down = utils.Dom.getAttr(child, "down");
        let width = utils.Dom.getAttr(child, "width");
        let height = utils.Dom.getAttr(child, "height");
        let align = utils.Dom.getAttr(child, "align");
        let vertical = utils.Dom.getAttr(child, "vertical");
        this.normorl = normorl;
        this.over = over;
        this.down = down;
        this.width = width;
        this.height = height;
        this.align = align;
        this._bgSrc = normorl;
        this.vertical = vertical;
    }

    /**
     * 设置按钮的默认背景
     * @param n 按钮上的显默认背景
     * */
    set normorl(n){
        this._normorl = n;
        this._bgSrc = n;
        this._html.css("background",`url(${this._bgSrc}) no-repeat`);
        this._html.css("background-size",`100% 100%`);
    }
    /**
     * 设置按钮的划过背景
     * @param o 按钮上的显划过背景
     * */
    set over(o){
        this._over = o;
    }
    /**
     * 设置按钮的鼠标落下背景
     * @param d 按钮上的显鼠标落下背景
     * */
    set down(d){
        this._down = d;
    }
    /**
     * 设置按钮宽度
     * @param t 按钮宽度
     * */
    set width(w){
        this._width = w;
        this._html.css("width",w);
        this._divDom.css('width', w)
    }
    get width(){
        return this._width
    }

    /**
     * 设置按钮高度
     * @param h 按钮高度
     * */
    set height(h){
        this._height = h;
        this._html.css("height",h);
    }
    get height(){
        return this._height
    }
    /**
     * 设置按钮的文字上下位置
     * @param v 按钮上文字上下位置
     * */
    set vertical(v){
        this._vertical = v;
        if(v == 'top'){
            this._divDom.css('top',0);
            this._divDom.css('transform','translateY(0)');
        } else if(v == 'middle') {
            this._divDom.css('top','50%');
            this._divDom.css('transform','translateY(-50%)');

        } else if(v == 'bottom'){
            this._divDom.css('top','100%');
            this._divDom.css('transform','translateY(-100%)');

        } else{
            console.warn('您输入的值有误， 请重新输入');
            return;
        }
    }
    get vertical(){
        return this._vertical
    }
    /**
     * 设置按钮的文字左右位置
     * @param a 按钮上文字左右位置
     * */
    set align(a){
        if(a === 'left' || a === "center" || a === 'right') {
            this._align = a;
            this._divDom.css('text-align',a);
        } else {
            console.warn('您输入的值有误， 请重新输入');
            return;
        }
    }
    get align(){
        return this._align
    }
    offClick() {
    }


    set mouseout(handler){
        this._event[base.EventBase.MOUSE_OUT] = handler;
    }

    set mouseover(handler){
        this._event[base.EventBase.MOUSE_OVER] = handler;
    }

    set mousedown(handler){
        this._event[base.EventBase.MOUSE_DOWN] = handler;
    }

    set mouseup(handler){
        this._event[base.EventBase.MOUSE_UP] = handler;
    }

    _bindEvent() {
        this._html.on("click", function () {
            this.runEvent(base.EventBase.CLICK, this);
        }.bind(this));

        this._html.on("mouseover", function () {
            this._bgSrc = this._over;
            this._html.css({'background': `url(${this._bgSrc}) no-repeat`, "background-size": '100% 100%'})
            this.runEvent(base.EventBase.MOUSE_OVER, this);
        }.bind(this));

        this._html.on("mouseout", function () {
            this._bgSrc = this._normorl;
            this._html.css({'background': `url(${this._bgSrc}) no-repeat`, "background-size": '100% 100%'})
            this.runEvent(base.EventBase.MOUSE_OUT, this);
        }.bind(this));

        this._html.on("mousedown", function () {
            this._bgSrc = this._down;
            this._html.css({'background': `url(${this._bgSrc}) no-repeat`, "background-size": '100% 100%'})
            this.runEvent(base.EventBase.MOUSE_DOWN, this);
        }.bind(this));

        this._html.on("mouseup", function () {
            this._bgSrc = this._over;
            this._html.css({'background': `url(${this._bgSrc}) no-repeat`, "background-size": '100% 100%'})
            this.runEvent(base.EventBase.MOUSE_UP, this);
        }.bind(this));

    }

    /**
     * 获取dom的显示对象
     * @returns 获取此控件的jsdom对象
     * */
    get dom() {
        return this._html[0];
    }

    /**
     * 设置按钮的显示文本
     * @param t 按钮上的显示文本
     * */
    set text(t) {
        this._text = t;
        this._divDom.text(t);
    }

    get text() {
        return this._text;
    }
    destorySelfProp(){
        this._normorl = null;
        this._over = null;
        this._down = null;
        this._width = null;
        this._height = null;
        this._align = null;
        this._bgSrc = null;
        this._vertical = null;
        this._divDom = null;
        this._html = null;
    }
    destorySelfEvent(){
        this._html.off('mouseup').off('mouseout').off('mousedown').off('mouseover').off('click');
    }
}
