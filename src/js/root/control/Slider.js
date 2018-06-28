control.Slider = class extends control.Base {
    constructor(direc = true, val = 0, innerSize = {
        width: 394,
        height: 24
    }, outerSize = {
        width: 400,
        height: 30
    }, sliderSize = {
        width: 40,
        height: 40
    }, heartShow = true, eventCycle) {
        super(eventCycle);
        this.name = 'Slider';
        this.version = "1.0.0" //控件的版本
        this.author = "liaohen"; //控件的制作人'
        this._direction = direc;
        this._value = val;
        this._innerSize = innerSize;
        this._outerSize = outerSize;
        this._sliderSize = sliderSize;
        this._heartShow = heartShow;
        this._outerDom = $(`<div></div>`);
        this._innerDom = $(`<div></div>`);
        this._heartDom = $(`<div></div>`);
        this._sliderDom = $(`<div></div>`);
        this._heartDom.append(this._sliderDom);
        this._innerDom.append(this._heartDom);
        this._outerDom.append(this._innerDom);
        this._heartSize = {
            width: Number.parseInt(innerSize.width * 0.05),
            height: Math.ceil(Number.parseInt(innerSize.height * 0.8) / 2) * 2,
        }
        this._bindEvent();
        this._sizeInit();
        this._valInit();
    }

    _bindEvent() {
        let dataX, dataY, sliderNow, heartNow, lenXMax = null;
        let downFlag = false;
        this._sliderDom[0].addEventListener('mousedown', (e) => {
            e.stopPropagation()
            this._heartDom[0].style.transition = 'none'
            this._sliderDom[0].style.transition = 'none'
            dataX = e.clientX - this._sliderDom[0].offsetLeft;
            dataY = e.clientY - this._sliderDom[0].offsetLeft;
            sliderNow = this._sliderDom[0];
            heartNow = this._heartDom[0];
            lenXMax = this._innerDom[0].offsetWidth - this._sliderDom[0].offsetWidth / 2;
            downFlag = true;
        }, false);
        let mousemoveFn = (e) => {
            if (downFlag) {
                e.preventDefault();
                if (this._direction) {
                    let rangeX = e.clientX - dataX;
                    if (rangeX < 0) {
                        rangeX = 0;
                    } else if (rangeX > lenXMax) {
                        rangeX = lenXMax;
                    }
                    sliderNow.style.left = rangeX + 'px';
                    heartNow.style.width = rangeX + 'px';
                } else {
                    let rangeY = e.clientY - dataY;
                    if (rangeY < 0) {
                        rangeY = 0;
                    } else if (rangeY > lenXMax) {
                        rangeY = lenXMax;
                    }
                    sliderNow.style.left = rangeY + 'px';
                    heartNow.style.width = rangeY + 'px';
                }
                this._value = Number.parseInt(heartNow.offsetWidth * 100 / lenXMax);
                this.runEvent(base.EventBase.CHANGE, this)
            }else{
                return;
            }
        }
        document.addEventListener('mousemove', mousemoveFn, false);
        document.addEventListener('mouseup', (e) => {
            this.runEvent(base.EventBase.CHANGE, this)
            sliderNow = heartNow = null;
            downFlag = false;
        }, false)
        this._innerDom[0].addEventListener('mousedown', (e) => {
            lenXMax = this._innerDom[0].offsetWidth - this._sliderDom[0].offsetWidth / 2;
            let posNowL = e.clientX - this._heartDom[0].getBoundingClientRect().left - this._sliderDom[0].offsetWidth / 2 < 0 ? 0 : e.clientX - this._heartDom[0].getBoundingClientRect().left - this._sliderDom[0].offsetWidth / 2;
            let posNowT = e.clientY - this._heartDom[0].getBoundingClientRect().top < 0 ? 0 : e.clientY - this._heartDom[0].getBoundingClientRect().top;
            let sliderL = this._sliderDom[0].offsetLeft;
            let sliderR = sliderL + this._sliderDom[0].offsetWidth;
            let formPercentFn = (arg, LMax) => {
                let res = Number.parseInt(arg * 100 / LMax) > 100 ? 100 : Number.parseInt(arg * 100 / LMax) > 0 ? Number.parseInt(arg * 100 / LMax) : 0;
                return res
            }
            if (this._direction) {
                if (posNowL < sliderL || posNowL > sliderR) {
                    this._sliderDom[0].style.left = `${posNowL}px`;
                    this._heartDom[0].style.width = `${posNowL}px`;
                    this._heartDom[0].style.transition = '0.5s';
                    this._sliderDom[0].style.transition = '0.5s';
                    this._value = formPercentFn(posNowL, lenXMax);
                }
            } else {
                if (posNowT < sliderL || posNowT > sliderR) {
                    this._sliderDom[0].style.left = `${posNowT}px`;
                    this._heartDom[0].style.width = `${posNowT}px`;
                    this._heartDom[0].style.transition = '0.5s';
                    this._sliderDom[0].style.transition = '0.5s';
                    this._value = formPercentFn(posNowT, lenXMax);
                }
            }
            this.runEvent(base.EventBase.CHANGE, this)
        }, false)
    }
    _sizeInit() {
        [
            this._innerDom[0].style.cssText,
            this._outerDom[0].style.cssText,
            this._sliderDom[0].style.cssText,
            this._heartDom[0].style.cssText,
        ] = [
            `width:${this._innerSize.width}px;height:${this._innerSize.height}px;`,
            `width:${this._outerSize.width}px;height:${this._outerSize.height}px;`,
            `width:${this._sliderSize.width}px;height:${this._sliderSize.height}px;`,
            `width:${this._heartSize.width}px;height:${this._heartSize.height}px;`
        ];
        this._innerDom.addClass('normal_inner');
        this._outerDom.addClass('normal_outer');
        this._sliderDom.addClass('normal_slider');
        this._heartDom.addClass('normal_heart');
        if (!this._direction) {
            this._outerDom.addClass('VERTICAL_SHOW');
        }
        if (!this._heartShow) {
            this._heartDom.addClass('HEART_SHOW');
        }
    }
    _valInit() {
        this._heartSize.width = this._innerSize.width * this._value / 100;
        this._heartDom[0].style.width = this._value + '%';
        this._sliderDom[0].style.left = Number.parseInt(this._heartSize.width) + 'px';
    }
    set change(handler) {
        if (this._stop) {
            this._stop = false;
            this.onEvent(base.EventBase.CHANGE, handler);
            return;
        }
        this.onEvent(base.EventBase.CHANGE, handler);
    }
    get width() {
        return this._outerDom[0].offsetWidth;
    }
    set width(t) {
        return null;
    }
    get direction() {
        return this._direction;
    }
    set direction(t) {
        this._direction = Boolean(t);
        if (!this._direction) {
            this._outerDom.addClass('VERTICAL_SHOW');
        } else {
            this._outerDom.removeClass('VERTICAL_SHOW');
        }
    }
    get value() {
        return this._value;
    }
    set value(t) {
        this._value = Number.parseInt(t) > 100 ? 100 : Number.parseInt(t) < 0 ? 0 : Number.parseInt(t);
        this._valInit();
        this.runEvent(base.EventBase.CHANGE, this);
    }
    get outerSize() {
        return this._outerSize;
    }
    set outerSize(json) {
        [this._outerSize.width, this._outerSize.height] = [json.width, json.height]
        this._outerDom[0].style.cssText = `width:${this._outerSize.width}px;height:${this._outerSize.height}px;`;
        this._outerDom.addClass('normal_outer');
        this._valInit();
    }
    get innerSize() {
        return this._innerSize;
    }
    set innerSize(json) {
        [this._innerSize.width, this._innerSize.height] = [json.width, json.height]
        this._innerDom[0].style.cssText = `width:${this._innerSize.width}px;height:${this._innerSize.height}px;`;
        this._innerDom.addClass('normal_inner');
        this._valInit();
    }
    get sliderSize() {
        return this._sliderSize;
    }
    set sliderSize(json) {
        [this._sliderSize.width, this._sliderSize.height] = [json.width, json.height]
        this._sliderDom[0].style.cssText = `width:${this._sliderSize.width}px;height:${this._sliderSize.height}px;`;
        this._sliderDom.addClass('normal_slider');
    }
    get heartShow() {
        return this._heartShow;
    }
    set heartShow(t) {
        this._heartShow = Boolean(t);
        if (!this._heartShow) {
            this._heartDom.addClass('HEART_SHOW')
        } else {
            this._heartDom.removeClass('HEART_SHOW')
        }
    }
    set innerStyle(t) {
        this._innerDom.addClass(t);
    }
    set outerStyle(t) {
        this._outerDom.addClass(t);
    }
    set sliderStyle(t) {
        this._sliderDom.addClass(t);
    }
    set heartStyle(t) {
        this._heartDom.addClass(t);
    }
    get dom() {
        return this._outerDom[0];
    }
    reflexPropSelf(child, reflex) {
        let val = utils.Dom.getAttr(child, "value");
        this.value = val;
    }

    /**
     * 删除自身的属性
     * */
    destorySelfProp() {
        this._direction = null;
        this._value = null;
        this._innerSize = null;
        this._outerSize = null;
        this._sliderSize = null;
        this._heartShow = null;
        this._outerDom = null;
        this._innerDom = null;
        this._heartDom = null;
        this._sliderDom = null;
        this._heartSize = null;
    }
    /**
     *删除自身的事件
     * */
    destorySelfEvent() {
        this._sliderDom.off("mousedown");
        this._innerDom.off("mousedown");
    }
}