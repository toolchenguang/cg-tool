/**
 * 基础的输入对象
 * @param eventCycle 事件生命周期
 *
 * @author create by heshang
 * */
control.Input = class extends control.Base {
    constructor(eventCycle) {
        super(eventCycle);
        this.name = "Input";
        this.version = "1.0.0"//控件的版本
        this.author = "heshang";//控件的制作人
        let html = `<span data-guid="${this.guid}">
                        <input type="text"/>
                    </span>`
        this._html = $(html);
    }

    set text(s) {
        this.html.find('input').val(s);
    }

    get text() {
        return this.html.find('input').val();
    }

    get dom() {
        return this.html[0];
    }

}