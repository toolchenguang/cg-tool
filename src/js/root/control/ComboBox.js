/**
 * select级联下拉框
 * @param obj 配置参数 
 * @param eventCycle 事件生命周期 
 * @example 1.  DOM反射
        * <comboBox
            data-control-type="control.ComboBox"
            data-selectList=[{
                value: 'xx',
                index: 'x',
                name: 'xxx',
                child: []
            }] >
        </comboBox>
 * @example 2. 实例化
 *      new control.ComboBox({
            selectList : [],                                   // 数据
            selectNotFoundText: '无数据',                      // 当没有数据时显示什么             默认显示[无匹配数据]
            defaultIndex : '1',                               // 设置默认当的前选中值，            默认选中第一个
            disUsed: false,                                   // 是否禁用                        默认false
            comboBoxStyle: control.ComboBox.DEFAULT_STYLE,    // 选择定义好的样式,或者是自己定义的class名  默认橙色皮肤
            disScroll: false                                  // 是否隐藏滚动条                   默认false
        });
 * @author create by hehe
 * */
control.ComboBox = class extends control.Base {
    constructor(obj = {}, eventCycle) {
        super(eventCycle);
        this.name = "ComboBox";
        this.version = "1.0.0";
        this.author = "hehe";

        this._html = $(`<div class="comboBox"></div>`);
        this.selectionDom = $(`<div class="comboBox-selection"></div>`);
        this.selectionPlaceholderDom = $(`<span class="comboBox-selection-placeholder">请选择</span> `);
        this.selectionArrowDom = $('<div><i class="comboBox-selection-arrow"></i></div>');
        this.selectionDom.append(this.selectionPlaceholderDom);
        this.selectionDom.append(this.selectionArrowDom);

        this.selectDropDownDom = $(`<div class="comboBox-dropdown"></div>`);
        this.selectDropDownNotFoundDom = $(`<div class="comboBox-dropdown-notfound">无匹配数据</div> `);
        this.selectOptionDom = $(`<ul class="comboBox-dropdown-list"></ul>`);
        // this.selectDropDownLoadDom = $(`<div class="comboBox-dropdown-loading">加载中...</div>`)
        this.selectDropDownDom.append(this.selectDropDownNotFoundDom);
        this.selectDropDownDom.append(this.selectOptionDom);
        // this.selectDropDownDom.append(this.selectDropDownLoadDom);

        this._html.append(this.selectionDom);
        this._html.append(this.selectDropDownDom);
        // 数据
        this._selectList = obj.selectList || [];
        // 无匹配数据时显示内容
        this._selectNotFoundText = obj.selectNotFoundText || '无匹配数据';
        // 默认选中
        this._defaultIndex = obj.defaultIndex || '';
        // 默认样式
        this._comboBoxStyle = obj.comboBoxStyle || '';
        // 当前选中内容（name value）
        this._curSelectObj = {};
        // 当前选中的子级
        this._curSelectChildArr = [];
        this._disUsed = obj.disUsed || false;
        // 是否隐藏进度条
        this._disScroll = obj.disScroll || false;
        // 初始化渲染页面
        this._renderSelectList();
        this._init();
    }

    _init() {
        this.disUsed = this._disUsed;
        this.disScroll = this._disScroll;
        this.comboBoxStyle = this._comboBoxStyle;
    }
    _bindEvent() {
        
        this._html.on("click", (e) => {
            // 初始化所有combobox样式
            $('.comboBox .comboBox-dropdown').slideUp();
            $('.comboBox-selection div').removeClass('comboBox-transform');
            e.stopPropagation(); 
            this.runEvent(base.EventBase.CLICK);
            // 伸缩效果
            if ($(this.selectDropDownDom).is(":hidden")) { 
                this.selectDropDownDom.slideDown(200);
                $(this.selectionDom[0].children[1]).addClass('comboBox-transform');
            } else {
                this.selectDropDownDom.slideUp(200);
                $(this.selectionDom[0].children[1]).removeClass('comboBox-transform');
            }
        })
        $(document).on('click', () => {
            this.selectDropDownDom.slideUp();
            $(this.selectionDom[0].children[1]).removeClass('comboBox-transform');
        })
    }
    /**
     * @returns {boolean} 返回当前控件是否被禁用
     * */
    get disUsed() {
        return this._disUsed;
    }
    /** 
     * @param v 设置当前控件是否被禁用
     * */
    set disUsed(v) {
        if (v) {
            this.selectionDom.addClass('comboBox-disable');
            this.selectionArrowDom.css('display', 'none');
            this.selectOptionDom.css('display', 'none');
            this._html.unbind('click');
        } else {
            this.selectionDom.removeClass('comboBox-disable');
            this.selectionArrowDom.css('display', 'block');
            this.selectOptionDom.css('display', 'block');
            this._html.unbind('click');
            // 绑定点击事件 
            this._bindEvent();
        }
    }
    /**
     * @returns {boolean} 返回当前控件是否隐藏进度条
     * */
    get disScroll() {
        return this._disScroll;
    }
    /** 
     * @param v 设置当前控件是否隐藏进度条
     * */
    set disScroll(v) {
        if (v) { 
            this.selectDropDownDom.css('overflow', 'hidden');
            this.selectOptionDom.css({ 'overflow-y': 'scroll', 'width': '1000px', 'height': '150px' });
        } else {
            this.selectDropDownDom.css('overflow-y', 'auto');
            this.selectOptionDom.css({ 'overflow-y': 'initial'});
        }
    }

    /** 
     * @param v 设置当前控件皮肤样式
     * */
    set comboBoxStyle(v) {
        switch (v) {
            case control.ComboBox.DEFAULT_STYLE:
                this.html.addClass("comboBox-defaultStyle");
                break;
            default:
                if (v) {
                    // 设置的自定义样式
                    this.html.removeClass("comboBox-defaultStyle");
                    this.html.addClass(v);
                } else {
                    this.html.addClass("comboBox-defaultStyle");
                }
                break;
        }
    }
    /**
     * @returns {string} 返回当前控件皮肤样式
     * */
    get comboBoxStyle() {
        return this._comboBoxStyle;
    }

    /** 
     * @param v 设置当前选中内容
     * */
    set curSelectObj(v) {
        this._curSelectObj = v;
        this.selectionPlaceholderDom.text(v.name);
    }
    /**
     * @returns {obj} 返回当前选中的内容
     * */
    get curSelectObj() {
        return this._curSelectObj;
    }

    /**
     * @returns {string}  返回当前选中内容的子级
     * */
    get curSelectChildArr() {
        return this._curSelectChildArr;
    }
    /** 
     * @param v 设置当前选中内容的子级
     * */
    set curSelectChildArr(v) {
        this._curSelectChildArr = v;
    }

    //初始化渲染列表
    _renderSelectList(valArr = this._selectList) {
        // 1.清空列表
        this.selectOptionDom.empty();
        this.selectDropDownNotFoundDom.text(this._selectNotFoundText);
        // this.selectDropDownLoadDom.css('display', 'block');  
        this.selectDropDownNotFoundDom.css('display', 'none');
        // 2.判断如果是空数组，显示对应描述文字，并返回
        if (!valArr || valArr.length == 0) {
            this.selectDropDownNotFoundDom.css('display', 'block');
            // this.selectDropDownLoadDom.css('display', 'none');
            this.selectOptionDom.empty();
            this.curSelectObj = {
                name: '',
                value: ''
            };
            this.selectionPlaceholderDom.text('-');
            return;
        }

        let flag = true;
        // 3遍历数组
        for (let i = 0; i < valArr.length; i++) {
            let valChildObj = valArr[i];
            let name = valChildObj.name;
            let val = valChildObj.value;
            let index = valChildObj.index;
            let child = valChildObj.child;
            let liDom = $(`<li class="comboBox-dropdown-item" data-val="${val}">${name}</li>`);
            let liArrowDom = $(`<span class="comboBox-arrow">></span>`);
            // 4判断如果是当前选中则添加样式
            if (this._defaultIndex) {
                if (this._defaultIndex === index && flag) {
                    this.curSelectObj = {
                        name: name,
                        value: val
                    };
                    this.curSelectChildArr = child;
                    liDom.addClass('comboBox-selectStyle').siblings().removeClass('comboBox-selectStyle');
                    this.selectionPlaceholderDom.text(name);
                    flag = false;
                }
            } else {
                if (i == 0) {
                    liDom.addClass('comboBox-selectStyle').siblings().removeClass('comboBox-selectStyle');
                    this.selectionPlaceholderDom.text(name);
                    this.curSelectObj = {
                        name: name,
                        value: val
                    };
                }
            }
            // 5 插入dom
            this.selectOptionDom.append(liDom);
            // 6 注册点击事件
            liDom.on("click", () => {
                let obj = {
                    name: name,
                    value: val
                }
                this.curSelectChildArr = child;
                this.curSelectObj = obj;
                this.selectionPlaceholderDom.text(name);
                this.runEvent(base.EventBase.CHANGE);
                if (name === this.curSelectObj.name) {
                    liDom.addClass('comboBox-selectStyle').siblings().removeClass('comboBox-selectStyle');
                }
            })
            // if (i == valArr.length - 1) {
            //     this.selectDropDownLoadDom.css('display', 'none')
            // }
        }
    }

    /**
     * @returns {string} 返回此控件数据列表
     * */
    get selectList() {
        return this._selectList;
    }
    /**
     * 设置数据列表
     * @param valArr 对象数组类型的数据列表
     * */
    set selectList(valArr) {
        this._selectList = [];
        this.selectOptionDom.empty();
        this._selectList = valArr;
        this._renderSelectList();
    }

    /**
     * 设置无匹配内容时显示的内容
     * @param v 无匹配内容时显示的内容
     * */
    set selectNotFoundText(v) {
        this._selectNotFoundText = v;
        this.selectDropDownNotFoundDom.text(v);
    }
    /**
     * 获取无匹配内容时显示的内容
     * @returns {string} 返回此控件无匹配内容时显示的内容
     * */
    get selectNotFoundText() {
        return this._selectNotFoundText;
    }

    /**
     * 设置默认选中值
     * @param v 默认选中值
     * */
    set defaultIndex(v) {
        this._defaultIndex = v;
        this._renderSelectList();
    }
    /**
     * 获取默认选中哪一个值
     * @returns {string} 返回此控件的初始化选中值
     * */
    get defaultIndex() {
        return this._defaultIndex;
    }

    // 映射
    reflexPropSelf(child, reflex) {
        let ListVal = utils.Dom.getAttr(child, "selectList");
        let NotFoundTextVal = utils.Dom.getAttr(child, "selectNotFoundText");
        let IndexVal = utils.Dom.getAttr(child, "defaultIndex");
        let StyleVal = utils.Dom.getAttr(child, "defaultStyle");
        let disUsedVal = utils.Dom.getAttr(child, "disUsed");
        let disScrollVal = utils.Dom.getAttr(child, "disScroll");
        this.selectList = eval(ListVal);
        this.selectNotFoundText = eval(NotFoundTextVal);
        this.defaultIndex = eval(IndexVal);
        this.comboBoxStyle = eval(StyleVal);
        this.disUsed = eval(disUsedVal);
        this.disScroll = eval(disScrollVal);
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
        this._html.off("click");
        this._html.off("change");
    }
    // 销毁属性
    destroySelfProp() {
        this._selectList = null;
        this._selectNotFoundText = null;
        this._defaultIndex = null;
        this._comboBoxStyle = null;
        this._curSelectObj = null;
        this._curSelectChildArr = null;
        this._disUsed = null;
        this._disScroll = null;
        this._html = null;
    }

}

control.ComboBox.DEFAULT_STYLE = 0;