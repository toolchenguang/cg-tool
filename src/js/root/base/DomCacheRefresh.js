/**
 * 缓存刷新dom类 单例 全局唯一控制
 * @author create by heshang
 * */
base.DomCacheRefresh = class {
    constructor() {
        this.styleList = [];
        this.tempT = null;
        this.freshNum = 0;
        this.startFreshCount = 100;//开始刷新的上限，达到上线后立即刷新style
        this.delayMs = 20;//延迟刷新style的毫秒数
    }

    /**
     *  单例类的对象
     * */
    static get instance() {
        return this._instance || (this._instance = new base.DomCacheRefresh());
    }

    /**
     * 添加对象属性进缓存池
     * @param control 对象
     * @param key 属性名称 || hash列表
     * @param value 属性名称对应的属性值
     * */
    addStyle(control, key, value) {
        if (!this.styleList[control.guid]) {
            let style = {};
            for (let i in control.dom.style) {
                if (control.dom.style[i] && typeof control.dom.style[i] != "function") {
                    style[i] = control.dom.style[i];
                }
            }
            this.styleList[control.guid] = {control: control, style: style};
        }
        if (typeof key === "string") {
            this.styleList[control.guid].style[key] = value;
        } else {
            for (let i in key) {
                this.styleList[control.guid].style[i] = key[i];
            }
        }

        this.startRefresh();
    }

    /**
     * 检测是否需要刷新 当需要刷新的缓存数量超过上线 或者小于定期刷新的事件间隔 执行刷新
     * */
    startRefresh() {
        this.freshNum++;
        if (this.freshNum >= this.startFreshCount) {
            this.fresh();
            return;
        }
        clearTimeout(this.tempT);
        this.tempT = setTimeout(function () {
            this.fresh();
        }.bind(this), this.delayMs);
    }

    /**
     * 刷新dom属性
     * */
    fresh() {
        this.freshNum = 0;
        clearTimeout(this.tempT);
        this.tempT = null;
        for (let i in this.styleList) {
            let control = this.styleList[i].control;
            let style = this.styleList[i].style;
            let str = JSON.stringify(style);
            str = str.replace(/\"/g, "");
            str = str.replace(/\{/g, "");
            str = str.replace(/\}/g, "");
            str = str.replace(/\,/g, ";");
            control.dom.style = str;
        }
        this.styleList = [];
    }
};
base.DomCacheRefresh._instance = null;