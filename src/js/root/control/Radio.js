/**
 * @param text 文本对象
 * @param eventCycle 生命周期
 * */
control.Radio = class extends control.Base {
    constructor(text, val, ev) {
        super(ev);
        this.name = "Radio";
        this.version = "1.0.0"//控件的版本
        this.author = "heshang";//控件的制作人
        this._selected = false;
        this._groupName = "";
        this.textDom = $(`<span>${this.text}</span>`);
        this.inputDom = $(`<input type="radio" value="${this._value}"/>`);
        let html = $(`<span></span>`);
        html.append(this.inputDom);
        html.append(this.textDom);
        this._html = html;
        this.value = val;
        this.text = text;
        this._bindEvent();
    }

    set selected(b) {
        if (b) {
            this.inputDom.attr("checked", "checked");
        } else {
            this.inputDom.removeAttr("checked");
        }
        this._selected = b;
    }

    get selected() {
        return this._selected;
    }

    _bindEvent() {
        this.inputDom.on("change", () => {
            this.changeParentPro();
        });
    }

    changeParentPro() {
        if (this.parent instanceof control.RadioGroup) {
            this.parent.selectIndex = this.parent.childList.indexOf(this);
            this.parent.selectItem = this;

            this.parent.disChange();
        }
    }

    get value() {
        return this._value;
    }

    reflexPropSelf(child, reflex) {
        let val = utils.Dom.getAttr(child, "value");
        this.value = val;
    }

    set groupName(n) {
        this.inputDom.attr("name", n);
        this._groupName = n;
    }

    set value(v) {
        this.inputDom.val(v);
        this._value = v;
    }

    get dom() {
        return this._html[0];
    }

    get text() {
        return this._text;
    }

    set text(t) {
        this.textDom.text(t);
        this._text = t;
    }
}