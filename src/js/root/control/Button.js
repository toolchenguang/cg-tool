/**
 * 基础的按钮对象
 * @param text  按钮的显示文本
 * @param eventCycle  事件生命周期
 * @example var b = new control.Button(null,"xxxx");
 * @author create by heshang
 * */
control.Button = class extends control.Base {
    constructor(text = "", eventCycle) {
        super(eventCycle);
        this.name = "Button";    //控件的名称
        this.version = "1.0.0";  //控件的版本
        this.author = "heshang"; //控件的制作人
        this._text = text;
        this._html = $(`<button class="button" data-guid="${this.guid}">${this.text}</button>`);
        this._bindClick();
    }

    offClick() {
    }

    _bindClick() {
        this._html.on("click", function () {
            this.runEvent(base.EventBase.CLICK, this);
        }.bind(this));
    }

    /**
     * 删除自身的属性
     * */
    destorySelfProp() {
        this._text = null;
    }

    /**
     *删除自身的事件
     * */
    destorySelfEvent() {
        this._html.off("click");
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
        this.html.text(this.text);
    }

    get text() {
        return this._text;
    }
}