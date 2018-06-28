control.UploadFile = class extends control.Base {
    constructor(text = "选择文件", ev) {
        super(ev);
        this._text = "";
        this.name = "Box";
        this.version = "1.0.0"//控件的版本
        this.author = "heshang";//控件的制作人
        this._box = $(`<div></div>`);
        this._html = $(`<span class="UploadFile_color UploadFile_inline">${text}</span>`);
        this._submit = $(`<span class="UploadFile_color UploadFile_inline">上传</span>`);
        this._tips = $(`<div></div>`);
        this._box.css("margin", "33px");
        this._tips.css("marginTop", "33px");
        this._input = $(`<input type="file"/>`);
        this._box.append(this._html);
        this._box.append(this._submit);
        this._box.append(this._tips);
        this._multiple = false;
        this._upFileType = [];
        this._allowSubmit = false;
        this._uploadIndex = 0;
        this._maxSize = null;
        this.allowSubmit = false;
        this.text = text;
        this._bindEvent();
    }

    set maxSize(s) {
        this._maxSize = s;
    }

    get maxSize() {
        return this._maxSize;
    }

    _bindEvent() {
        this._html.on("click", () => {
            //打开选择文件夹
            this._input[0].click();
        });
        this._submit.on("click", () => {
            //上传文件
            this._submitFile();
        });
        this._input.on("change", () => {
            //选择文件 判断是否成立
            this._selectedFile();
        });
    }

    _uploadFinish() {
        // this._input[0].outerHTML = this._input[0].outerHTML;
        // this._selectedFile();
        this.allowSubmit = false;
    }

    _uploadFile() {
        if (this._uploadIndex >= this._input[0].files.length) {
            this._uploadFinish();
            return;
        }
        let file = this._input[0].files[this._uploadIndex];
        let formData = new FormData();
        let url = "";
        if (window.location.origin.indexOf("66rpg.com") <= -1) {
            url = "http://role6-test-www.66rpg.com";
        } else {
            url = window.location.origin;
        }
        //获取验证信息
        utils.Ajax.get(url + "/ajax/OssAuth/getUploadTempAuth", null, (rcvData) => {
            let d = rcvData.data;
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
                var md5str = md5(e.target.result);
                let key = "upload/" + md5str.substr(0, 2) + "/" + md5str;
                if (file.type === "audio/mp3") {
                    debugger;
                    key += ".mp3";
                }
                formData.append("key", key);
                formData.append("policy", d.policy);
                formData.append("OSSAccessKeyId", d.accessid);
                formData.append("signature", d.signature);
                formData.append("x-oss-security-token", d.token);
                formData.append("name", file.name);
                formData.append("file", file);
                utils.Ajax.postFormData("//cg-back.cgyouxi.com/", formData, (data) => {
                    this._tips.append($(`<div>文件:<b>${file.name}</b>上传成功,链接: <b>${"http://" + d.cdn + "/" + key}</b></div>`))
                    this._nextUpLoad();
                }, () => {
                    this._tips.append($(`<div>文件:<b style="color:red">${file.name}</b>上传失败。请重试。</div>`))
                    this._nextUpLoad();
                });
            }
        });
        // utils.Ajax.post("", formData, (data) => {
        //     this._nextUpLoad()
        // }, (data) => {
        //     this._nextUpLoad();
        // });
    }

    _nextUpLoad() {
        this._uploadIndex++;
        this._uploadFile();
    }

    _submitFile() {
        if (this._allowSubmit) {
            this._uploadIndex = 0;
            this._tips.html("");
            this._uploadFile();
        } else {
            // this._typeError();
        }
    }

    _selectedFile() {
        this.allowSubmit = false;
        this._tips.html("");
        if (this._input[0].files.length > 0) {
            if (!this.checkFileType) {
                this._typeError();
                return;
            }
            this.allowSubmit = true;
            this._selectedFileTips();
            return;
        }
        this.allowSubmit = false;
    }

    _typeError() {
        alert("请检查文件类型、文件大小。");
    }

    get checkFileType() {
        // if (this._upFileType.length <= 0) {
        //     return true;
        // }
        for (let i = 0; i < this._input[0].files.length; i++) {
            let type = this._input[0].files[i].type;
            // let name = this._input[0].files[i].name;
            // let fileType = name.split('.');
            // let flieTypeName = fileType[fileType.length - 1];
            if (this.maxSize && (this.maxSize > 0) && this._input[0].files[i].size >= this.maxSize) {
                return false;
            }
            if (this._upFileType.indexOf(type.toLowerCase()) > -1) {
                return true;
            }
        }
        return false;
    }

    _selectedFileTips() {
        this._tips.html("");
        for (let i = 0; i < this._input[0].files.length; i++) {
            this._tips.append($(`<div>已选择文件:<b>${this._input[0].files[i].name}</b></div>`));
        }
    }

    set allowSubmit(b) {
        this._allowSubmit = b;
        if (b) {
            this._submit.removeClass("UploadFile_disable").addClass("UploadFile_color");
        } else {
            this._submit.removeClass("UploadFile_color").addClass("UploadFile_disable");
        }
    }

    set upFileType(arr) {
        this._upFileType = arr;
    }

    set multiple(b) {
        this._multiple = b;
        if (b) {
            this._input.attr("multiple", "true");
        } else {
            this._input.removeAttr("multiple");
        }

    }

    get multiple() {
        return this._multiple;
    }

    set change(handler) {
        if (this._stop) {
            this._stop = false;
            return;
        }
        this.onEvent(base.EventBase.CHANGE, handler);
    }

    set text(t) {
        this._text = t;
    }

    get text() {
        return this._text;
    }

    get dom() {
        return this._box[0];
    }
}