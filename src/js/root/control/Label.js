/**
 * 基础的文本显示对象
 *  @param text 文本对象
 *  @param eventCycle 生命周期
 *  @author create by heshang
 * */
control.Label = class extends control.Base {
    constructor(text = "", eventCycle) {
        super(eventCycle);
        this.name = "Label";
        this.version = "1.0.0"//控件的版本
        this.author = "heshang";//控件的制作人
        let _this = this;
        this.vuebox = $(`<div id="box_${this.guid}"></div>`);
        this.data = {
            msg: text
        }
        this._html = `<span data-guid="${this.guid}" ref="myBox" @click="click">{{msg}}</span>`
    }

    checkVue() {
        if (!this.vue) {
            let _this = this;
            if(this.parent){
                this.parent.dom.appendChild(this.vuebox[0]);
            }else{
                document.body.appendChild(this.vuebox[0]);
            }
            this.vue = new Vue({
                el: `#box_${this.guid}`,
                template: this.html,
                data() {
                    return _this.data;
                },
                methods: {
                    click: function () {
                        _this.runEvent(base.EventBase.CLICK, _this);
                    }
                }
            });
        }
    }

    get dom() {
        this.checkVue();
        return this.vue.$refs.myBox;
    }

    set text(s) {
        this.data.msg = s;
    }
    get text(){
        return this.data.msg;
    }
}