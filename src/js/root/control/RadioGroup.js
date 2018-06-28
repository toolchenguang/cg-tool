control.RadioGroup = class extends control.Base {
    constructor(ev) {
        super(ev);
        this.name = "Radio";
        this.version = "1.0.0"//控件的版本
        this.author = "heshang";//控件的制作人
        this._selectIndex = -1;
        this._selectItem = null;
        let html = $(`<span></span>`);
        this._html = html;
        this._groupName = "";
    }

    set selectIndex(index) {
        if (index < this.childList.length) {
            this._selectIndex = index;
            this._selectItem = this.childList[index];
            this.selectItem.selected = true;
        } else if (this.debugger) {
            console.warn(`radioGroup guid:${this.guid} childList length:${this.childList.length},set index:${index}`);
        }
    }

    get selectIndex() {
        return this._selectIndex;
    }

    set selectItem(item) {
        let index = this.childList.indexOf(item);
        if (index >= 0) {
            this.selectIndex = index;
        }

    }

    get selectItem() {
        return this._selectItem;
    }

    disChange() {
        this.runEvent(base.EventBase.CHANGE);
    }

    reflexPropSelf(child, reflex) {
        let name = utils.Dom.getAttr(child, "name");
        let selectIndex = utils.Dom.getAttr(child, "selectIndex");
        reflex.ready(base.Handler.create(function () {
            this.groupName = name;
            if (selectIndex) {
                this.selectIndex = selectIndex;
            }
        }, this, "加载完成"))
    }

    set groupName(n) {
        for (let i = 0; i < this.childList.length; i++) {
            if (this.childList[i] instanceof control.Radio) {
                this.childList[i].groupName = n;
            }
        }
        this._groupName = n;
    }

    get dom() {
        return this._html[0];
    }

    get text() {
        return this._text;
    }

    set text(t) {
        this._text = t;
    }
}