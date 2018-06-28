/**
 *  控件的基础属性
 *  @param name 控件名称
 *  @param version 控件版本
 *  @param author 控件作者
 *  @param width 控件宽度
 *  @param height 控件高度
 *
 *  @author create by heshang
 * */
var base = {};
var control = {};
var compents = {};
var utils = {};
var errlog = {};

base.Controller = class {
    static getItemById(guid) {
        return this.boxObj[guid];
    }

    static setItemById(guid, item) {
        this.boxObj[guid] = item;
    }

    static delItemById(guid) {
        delete this.boxObj[guid];
    }
}
base.Controller.boxObj = {}

base.EventPrope = class {
    constructor() {
        this.debugger = true;
        base.EventPrope.control_un_id++;//全局唯一
        this._name = "";
        this._version = "0.0.1";                                      //控件的版本
        this._author = "";
        this._guid = 'control_' + base.EventPrope.control_un_id;   //控件的唯一id

        this._tempDomStr = "";//这个是优化拼接style属性的使用
        //todo  后期定义的控件的公共属性
        this._width = 100;
        this._height = 50;
        this._style = "";
        this._html = "";                                              //模板
        //增加的公共属性
        this._visibility = "visible";
        this._zindex = 0;
        this._tabindex = 0;
    }

    changeStyleStr() {
        // this.dom.style
    }

    set tabindex(t) {
        this._tabindex = t;
    }

    get tabindex() {
        return this._tabindex;
    }

    get dom() {
        return "";
    }

    get html() {
        return this._html;
    }

    get guid() {
        return this._guid;
    }

    setControllerItem(oldG, newG) {

        base.Controller.delItemById(oldG);
        base.Controller.setItemById(newG, this);
        if (this.dom) {
            this.dom.setAttribute("data-guid", this._guid);
        }
    }

    set guid(g) {
        if (this.guid != g || this.guid != "") {
            this.setControllerItem(this._guid, g);
            this._guid = g;
        }
    }

    get name() {
        return this._name;
    }

    set name(n) {
        this._name = n;
    }

    get version() {
        return this._version;
    }

    set version(v) {
        this._version = v;
    }

    get author() {
        return this._author;
    }

    set author(a) {
        this._author = a;
    }

    get width() {
        return this._width;
    }

    set width(w) {
        this._width = w;
    }

    get height() {
        return this._height;
    }

    set height(h) {
        this._height = h;
    }
}

base.EventPrope.control_un_id = 0;