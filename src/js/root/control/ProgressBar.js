/**
 * progressBar 进度条
 * @param obj  配置参数
 * @param eventCycle  事件生命周期 
 * @example 1.  DOM反射
        * <progressBar data-control-type="control.ProgressBar" data-progressVal='15'></progressBar>
 * @example 2. 实例化
 *      new control.ProgressBar({
            isShowProgressVal: false,                                    //是否显示进度值          默认true
            progressVal: 60,                                             //进度值                  *必填
            progressTime: 1000,                                          //动画完成所需要的时间     默认1000
            progressBarStyle: control.ProgressBar.SINGLECOLOR_STYLE,     //进度条样式              默认单色
            progressValStyle: control.ProgressBar.PERTOP_STYLE,          // 进度值样式             默认中间
            progressDesc: '开始加载'                                      // 进度值的描述内容(进度值的样式在上方时会有)      默认空
        });
 * @author create by hehe
 * */
control.ProgressBar = class extends control.Base {
    constructor(obj = {}, eventCycle) {
        super(eventCycle);
        this.name = "ProgressBar";
        this.version = "1.0.0";
        this.author = "hehe";

        this._html = $(`<div class="progressBar"></div>`);
        this.progressBgDom = $(`<div class="progressBar-bg"></div>`);
        this.barDom = $(`<div class="progressBar-progress"></div>`);
        this.progressValDom = $(`<span class="progressBar-val"></span>`);
        this.progressBgDom.append(this.barDom);
        this._html.append(this.progressBgDom);
        this._html.append(this.progressValDom);
        // 进度条底色样式
        this._progressBarStyle = obj.progressBarStyle || control.ProgressBar.SINGLECOLOR_STYLE;
        // 进度条样式
        this._progressValStyle = obj.progressValStyle || control.ProgressBar.PERCENTER_STYLE;
        // 进度值
        this._progressVal = obj.progressVal || 0;
        // 是否显示进度值
        this._isShowProgressVal = obj.isShowProgressVal || false;
        // 多少时间展示完
        this._progressTime = obj.progressTime || 1000;
        // 实时进度值 
        this._progresFlag = 0;
        // 进度值描述
        this._progressDesc = obj.progressDesc || '';

        this.init();
    }


    init() {
        this.progressBarStyle = this._progressBarStyle;
        this.progressValStyle = this._progressValStyle;
        this.progressVal = this._progressVal;
        this.isShowProgressVal = this._isShowProgressVal;
    }
    /** 
     * @returns {string} 获取获取实时进度值
     * */
    get progresFlag() {
        return this._progresFlag;
    }

    /** 
     * @returns {string} 获取进度值描述
     * */
    get progressDesc() {
        return this._progressDesc || '';
    }
    /**
     * 设置进度描述
     * @param v 进度值描述 
     * */
    set progressDesc(v) {
        this._progressDesc = v;
        this.progressValDom.text(v + this._progresFlag + '%');
    }

    /** 
     * @returns {boolean} 获取是否显示进度值
     * */
    get isShowProgressVal() {
        return this._isShowProgressVal;
    }
    /** 
     * @param v 是否显示进度值
     * */
    set isShowProgressVal(v) {
        this._isShowProgressVal = v;
        let isShow = v ? 'none' : 'block';
        this.progressValDom.css('display', isShow);
    }
    /** 
     * @returns {string} 获取进度值
     * */
    get progressVal() {
        return this._progressVal;
    }
    /** 
     * @param v 进度值
     * */
    set progressVal(v) {
        let oldVal = this._progressVal;
        this._progressVal = v > 100 ? 100 : v;
        var speed;
        if (oldVal != this.progressVal) {
            speed = Math.abs(this.progressVal - oldVal);
        } else {
            speed = this.progressVal;
        } 
        // 进度值以+1累加
        let time = parseInt(this._progressTime / speed) || 500;
        let Timer = setInterval(() => {
            if (this._progresFlag == this._progressVal) {
                clearInterval(Timer);
                return;
            } else if (this._progresFlag > this._progressVal) {
                --this._progresFlag;
            } else if (this._progresFlag < this._progressVal) {
                ++this._progresFlag;
            }
            this.runEvent(base.EventBase.CHANGE); 
            this.progressValDom.text(this.progressDesc + this._progresFlag + '%');
            this.barDom.stop();
            this.progressValDom.stop();

        }, time);
        // 改变进度条宽，进度值
        setTimeout(() => {
            this.barDom.css({ 'width': this.html.width() * (this._progressVal / 100), 'transition-duration': this._progressTime / 1000 + 's' });
            if (this._progressValStyle == control.ProgressBar.PERCENTER_STYLE) {
                this.progressValDom.css({ 'left': this.html.width() * (this._progressVal / 100) - 20, 'transition-duration': this._progressTime / 1000 + 's' });
            }
        }, 0);
    }

    /**
     * 设置进度条样式
     * @param v 进度条的样式
     *:     1：单色皮肤
            2：渐变皮肤 
     * */
    set progressBarStyle(v) {
        let _v = v - 0;
        switch (_v) {
            case control.ProgressBar.SINGLECOLOR_STYLE:
                this.html.removeClass("progressBar-barStyle-Gradual");
                this.html.addClass("progressBar-barStyle-singleColor");
                break;
            case control.ProgressBar.GRADUAL_STYLE:
                this.html.removeClass("progressBar-barStyle-singleColor");
                this.html.addClass("progressBar-barStyle-Gradual");
                break;
            default:
                this.html.addClass("progressBar-barStyle-singleColor");
                break;
        }
    }
    /**
     * 设置进度值样式
     * @param v 进度值的样式
     *:     1：悬浮上面
            2：悬浮中间
            3：悬浮右面
     * */
    set progressValStyle(v) {
        switch (v) {
            case control.ProgressBar.PERTOP_STYLE:
                this.progressValDom.removeClass("progressBar-percentStyle-center progressBar-percentStyle-right");
                this.progressValDom.addClass("progressBar-percentStyle-top");
                break;
            case control.ProgressBar.PERCENTER_STYLE:
                this.progressValDom.removeClass("progressBar-percentStyle-top progressBar-percentStyle-right");
                this.progressValDom.addClass("progressBar-percentStyle-center");
                break;
            case control.ProgressBar.PERRIGHT_STYLE:
                this.progressValDom.removeClass("progressBar-percentStyle-top progressBar-percentStyle-center");
                this.progressValDom.addClass("progressBar-percentStyle-right");
                break;
            default:
                if (v) {
                    console.log(v);
                    // 设置的自定义样式
                    this.progressValDom.removeClass("progressBar-percentStyle-top progressBar-percentStyle-center progressBar-percentStyle-right");
                    this.progressValDom.addClass(v);
                } else {
                    console.log(v);
                    this.progressValDom.addClass("progressBar-percentStyle-top");
                }
                break;
        }
    }

    set change(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CHANGE, handler);
    }

    reflexPropSelf(child, reflex) {
        let progressVal = utils.Dom.getAttr(child, "progressVal");
        let isShowProgressVal = utils.Dom.getAttr(child, "isShowProgressVal");
        let progressTimeVal = utils.Dom.getAttr(child, "progressTime");
        let progressBarStyleVal = utils.Dom.getAttr(child, "progressBarStyle");
        let progressValStyleVal = utils.Dom.getAttr(child, "progressValStyle");
        let progressDescVal = utils.Dom.getAttr(child, "progressDesc");

        this.progressVal = eval(progressVal);
        this.isShowProgressVal = eval(isShowProgressVal);
        this.progressTime = eval(progressTimeVal);
        this.progressBarStyle = eval(progressBarStyleVal);
        this.progressValStyle = eval(progressValStyleVal);
        this.progressDesc = eval(progressDescVal);
    }
    /**
     * 获取dom的显示对象
     * @returns {string} 获取此控件的jsdom对象
     * */
    get dom() {
        return this._html[0];
    }

    // 销毁事件
    destroySelfEvent() { 
        this._html.off("change"); 
    }
    // 销毁属性
    destroySelfProp() {
        this._progressBarStyle = null; 
        this._progressValStyle = null; 
        this._progressVal = null; 
        this._isShowProgressVal = null; 
        this._progressTime = null; 
        this._progresFlag = null; 
        this._progressDesc = null;
        this._html = null;
    }
}
control.ProgressBar.SINGLECOLOR_STYLE = 1;
control.ProgressBar.GRADUAL_STYLE = 2;

control.ProgressBar.PERTOP_STYLE = 1;
control.ProgressBar.PERCENTER_STYLE = 2;
control.ProgressBar.PERRIGHT_STYLE = 3;
