control.CheckGroup = class extends control.Base {
    constructor(name, eventCycle) {
        super(eventCycle);
        this._selectIndex = [];
        this._selectItem = [];
        this._groupName = name;
        this._html = $("<span></span>");
    }

    get dom() {
        return this._html[0];
    }

    set change(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CHANGE, handler);
    }

    reflexPropSelf(child, reflex) {
        let name = utils.Dom.getAttr(child, "groupName");
        reflex.ready(base.Handler.create(function () {
            this.groupName = name;
        }, this));
    }

    changeSelectedIndex(item) {
        let checked = item.checked;
        let index = this.childList.indexOf(item);
        let itemIndex = this._selectIndex.indexOf(index);
        if (itemIndex < 0 && checked) {
            this._selectIndex.push(index);
        } else if (!checked && itemIndex >= 0) {
            this._selectIndex.splice(itemIndex, 1);
        }
        this.selectIndex.sort();
        this.runEvent(base.EventBase.CHANGE);
    }

    set groupName(name) {
        for (let i = 0; i < this.childList.length; i++) {
            this.childList[i].groupName = name;
        }
    }

    get groupName() {
        return this._groupName;
    }

    addChildOther(node) {
        node.groupName = this.groupName;
    }

    get selectIndex() {
        return this._selectIndex;
    }

    set selectIndex(b) {
        if (this.debugger) {
            if (!(b instanceof Array)) {
                console.warn(b + "< is not array");
                return;
            }
        }
        this._selectIndex = b;
        for (let i = 0; i < b.length; i++) {
            if (this.childList[i]) {
                this.childList[i].checked = false;
            }
            if (!this.childList[b[i]]) {
                continue;
            }
            if (this.childList[b[i]]) {
                this.childList[b[i]].checked = true;
            }
        }
    }

    selectedBool(b) {
        for (let i = 0; i < this.childList.length; i++) {
            this.childList[i].checked = b;
        }
    }

    selectRevert() {
        for (let i = 0; i < this.childList.length; i++) {
            this.childList[i].checked = !this.childList[i].checked;
        }
    }
}