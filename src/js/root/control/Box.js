/**
 * 基础的盒子对象
 *
 * @author create by heshang
 * */
control.Box = class extends control.Base {
    constructor(eventCycle) {
        super(eventCycle);
        this.name = "Box";
        this.version = "1.0.0"//控件的版本
        this.author = "heshang";//控件的制作人
        this._html = $(`<div data-guid="${this.guid}"></div>`);
    }

    get dom() {
        return this.html[0];
    }

    set text(t){
        this._text = t;
        this.html.text(t);
    }
}
