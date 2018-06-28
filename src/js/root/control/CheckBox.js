control.CheckBox = class extends control.Base {
    constructor(name = "", val = "", eventCycle) {
        super(eventCycle);
        this._html = $(`<span></span>`);
        this.inputDom = $(`<input type='checkbox' value="${val}"/>`);
        this.textDom = $(`<span>${name}</span>`);
        this._html.append(this.inputDom);
        this._html.append(this.textDom);
        this.value = val;
        this.controlName = name;
        this._checked = false;
        this._groupName = "";
        this._showType = "";
        this._text = name;
        this.bindEvent();
    }

    set text(t) {
        this._text = t;
        this.textDom.text(t);
    }

    get text() {
        return this._text;
    }

    set groupName(n) {
        this._groupName = n;
        this.inputDom.attr("name", n);
    }

    bindEvent() {
        this._html.on("click", () => {
            this.runEvent(base.EventBase.CLICK);
            this.checked = !this.checked;
        })
    }

    set change(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CHANGE, handler);
    }

    set click(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CLICK, handler);
    }

    set showType(t) {
        this.inputDom.addClass(t);
        this._showType = t;
    }

    get checked() {
        return this._checked;
    }

    set checked(b) {
        this.inputDom.prop("checked", b);
        this._checked = b;
        if (this._parent && this._parent instanceof control.CheckGroup) {
            this._parent.changeSelectedIndex(this);
        }
        this.runEvent(base.EventBase.CHANGE);
    }

    get dom() {//返回原生的js   Dom对象
        return this._html[0];
    }

    destorySelfEvent() {
        this._html.off("click");
    }

    destorySelfProp() {

    }
}