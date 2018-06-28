errlog.Error = class {
    constructor() {

    }

    static throwError(a, b, c, d, e) {
        let divMask;
        let divDialog;
        let divTitle;
        let divContent;

        function createMask() {
            divMask = $(`<div></div>`);
            divMask.css({
                "position": "absolute",
                "width": "100%",
                "height": "100%",
                "top": 0,
                "left": 0,
                "backgroundColor": "black",
                "opacity": .8,
                "zIndex": 999
            });
            $("body").append(divMask);
        }

        function createDialog() {
            divDialog = $(`<div></div>`);
            divDialog.css({
                "position": "absolute",
                "width": "500px",
                "height": "400px",
                "top": "50%",
                "left": "50%",
                "border-radius": "30px",
                "transform": "translate(-50%,-50%)",
                "backgroundColor": "white",
                "zIndex": 999,
                "overflow": "auto",
            });
        }

        function createTitle() {
            divTitle = $(`<div></div>`);
            divTitle.text("错误提示⚠");
            divTitle.css({
                "fontWeight": "bold",
                "fontSize": "18px",
                "text-align": "center",
                "marginTop": "15px",
            })
            divDialog.append(divTitle);
        }

        function createContent() {
            divContent = $(`<div style="font-size: 14px;padding:25px">
                                <div>
                                    <span>错误信息:</span>
                                    <span style="color:red">${a}</span>
                                </div>
                                <div>
                                    <span>错误堆栈:</span>
                                    <span style="color:red">${e && e.stack}</span>
                                </div>
                                <div>
                                    <span>错误文件:</span>
                                    <span style="color:red">${b}</span>
                                </div>
                                <div>
                                    <span>错误行数:</span>
                                    <span style="color:red">${c}</span>
                                </div>
                                <div>
                                    <span>错误列数:</span>
                                    <span style="color:red">${d}</span>
                                </div>
                            </div>`);
            divDialog.append(divContent);
        }

        createMask();
        createDialog();
        createTitle();
        createContent();
        $(() => {
            $("body").append(divDialog);
            divMask.click(() => {
                divMask.remove();
                divDialog.remove();
            })
        })

    }
}
window.onerror = errlog.Error.throwError;