

/**
 * TextBox控件
 * @author likui
 * @example let textBox1 = new control.TextBox("number",123);
 * textBox1.min = -10;
 * textBxo1.max = 10;
 * textBox1.change = base.Handler.create((e)=>{
 *      console.log(e);
 * })
 * @example <textbox data-control-type="control.TextBox" data-showType = "number" data-value=123 data-min=-10 data-max=10></textbox>
 */
control.TextBox = class extends control.Base{
    constructor(showType = "string",val = "",ev){
        super(ev);
        this._val = val;
        if (!control.TextBox.textType[showType]){
            throw new TypeError("应该输入有效的类型(float,int,string,password,text,number)");
        }
        this._regex = "";
        this._testReg = false;
        this._showType = showType;
        this._maxValue = undefined;
        this._minValue = undefined;
        this._disabled = undefined;
        this._inputDom = $(`<input type='${control.TextBox.textType[this._showType]}' style="outline:none;" value='${this._val}'/>`);
        this._width = this._inputDom.css("width");
        this._height = this._inputDom.css("height");
        this._html = $(`<span style="display: inline-block;"></span>`);
        this._html.append(this._inputDom);
        this._bindEvent();
    }

    get disabled(){
        return this._disabled;
    }

    set disabled(value){
        this._disabled = value;
        this._inputDom.attr("disabled",value);
    }

    /**
     * @returns 返回当前控件是否要进行正则匹配
     */
    get testReg(){
        return this._testReg;
    }

    /**
     * 设置是否进行正则匹配
     * @param isReg 是否进行正则匹配
     */
    set testReg(isReg){
        this._testReg = isReg;
    }

    /**
     * @returns 获取正则匹配的字符串
     */
    get regex(){
        return this._regex;
    }

    /**
     * 设置正则匹配字符串
     * @param regexStr 设置正则匹配的字符串
     */
    set regex(regexStr){
        this._regex = regexStr;
    }

    /**
     * 获取控件宽度
     */
    get width(){
        return this._width;
    }

    /**
     * 设置控件宽度
     * @param value 控件的宽度值
     */
    set width(value){
        this._width = value;
        this._inputDom.css("width",value);
        this._html.css("width",value);
    }

    /**
     * 获取控件高度
     */
    get height(){
        return this._height;
    }

    /**
     * 设置控件高度
     * @param value 控件的高度值
     */
    set height(value){
        this._height = value;
        this._inputDom.css("height",value);
        this._html.css("height",value);
    }

    /**
     * 获取当前的控件内容的类型
     * @returns 返回当前的控件内容的类型
     */
    get showType(){
        return this._showType;
    }

    /**
     * 设置当前的控件内容的数据类型
     * @param showType 
     */
    set showType(showType){
        this._inputDom.attr("type",control.TextBox.textType[showType]);
        this._showType = showType;
    }

    /**
     * 获取TextBox的值
     * @returns 返回控件的显示内容
     */
    get value(){
        return this._val;
    }

    /**
     * 设置控件的显示内容
     * @param val 显示的内容值
     */
    set value(val){
        this._val = val;
        this._inputDom.val(val);
    }

    /**
     * 获取最小值（仅input type="number"）时有效
     * @returns 返回当前控件的最小值
     */
    get min(){
        if (this._inputDom.attr("type") !== "number"){
            return NaN;
        }
        return this._minValue;
    }

    /**
     * 设置当前控件的最小值
     * @returns 最小值
     */
    set min(value){
        if(this._inputDom.attr("type") !== "number"){
            return;
        }
        this._inputDom.attr("min",value);
        this._minValue = value;
    }

    /**
     * 返回当前控件的最大值
     * @returns 当前控件的最大值
     */
    get max () {
        if(this._inputDom.attr("type") !== "number"){
            return NaN;
        }
        return this._maxValue;
    }

    /**
     * 设置当前控件的最大值
     * @param value 设置的控件的值
     */
    set max(value){
        if(this._inputDom.attr("type") !== "number"){
            return;
        }
        this._maxValue = value;
        this._inputDom.attr("max",value);
    }

    /**
     * 删除自身的控件引用
     */
    destroySelfEvent(){
        this._inputDom.off("mousewheel");
        this._inputDom.off("change");
        this._inputDom.off("input propertychange")
    }

    /**
     * 删除自身的属性引用
     */
    destroySelfProp(){
        this._val = null;
        this._regex = null;
        this._showType = null;
        this._width = null;
        this._height = null;
        this._maxValue = null;
        this._minValue = null;
        this._disabled = null;
        this._inputDom = null;
        this._html = null;
    }

    /**
     * 进行事件绑定
     */
    _bindEvent(){
        this._inputDom.on("mousewheel",(ev)=> {
            if(this._inputDom.prop("type") !== "number"){
                return;
            }
            if(!this._inputDom.is(":focus")){
                return;
            }
            let wheel = ev.originalEvent.wheelDeltaY;
            let curValue = this._inputDom.val();
            if(wheel<0 && this._minValue && curValue<=this._minValue){
                return;
            }
            else if(wheel>0 && this._maxValue && curValue>=this._maxValue){
                return;
            }
            let tmpl = parseInt(this._inputDom.val());
            this.value = tmpl+parseInt(wheel/120);
            if(this._val<this._minValue){
                this.value = this._minValue;
            }
            if(this._val>this._maxValue){
                this.value = this._maxValue;
            }
        })
        this._inputDom.on("change", (ev)=>{
            this.value = ev.target.value;
            this.runEvent(base.EventBase.CHANGE, this);
        })
        this._inputDom.on("input",(ev)=>{
            this.value = ev.target.value;
            this.runEvent(base.EventBase.CHANGE,this);
        })
    }
    
    /**
     * 
     * @param {*} child 属性反射实现
     * @param {*} reflex 
     */
    reflexPropSelf(child,reflex){
        let showType = utils.Dom.getAttr(child, "showType");
        this.showType = control.TextBox.textType[showType];

        let value = utils.Dom.getAttr(child,"value");
        this.value = value;

        let min = utils.Dom.getAttr(child,"min");
        this.min = min;

        let max = utils.Dom.getAttr(child,"max");
        this.max = max;

        let testReg = utils.Dom.getAttr(child,"testReg");
        this._testReg = testReg;

        let controlWidth = utils.Dom.getAttr(child,"width");
        this.width = controlWidth;

        let controlHeight = utils.Dom.getAttr(child,"height");
        this.height = controlHeight;
    }

    /**
     * 返回当前的dom值
     * @returns 当前的dom值
     */
    get dom(){
        return this._html[0];
    }
}

/**
 * 当前的内容的类型
 */
control.TextBox.textType = {
    float:"number",
    int:"number",
    string:"text",
    password:"password",
    text:"text",
    number:"number"
}