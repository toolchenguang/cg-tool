/**
 * 图片控件
 * 
 * @author wuji
 */
control.Image = class extends control.Base{
    /**
     * 
     * @param {宽} width 
     * @param {高} height 
     * @param {周期状态} eventCycle 
     */
    constructor(width,height,eventCycle){
        super(eventCycle);
        this._imgDom = $("<img>");
        this._width = width||"0px";
        this._height = height||"0px";
        this._imgDom.attr("width",`${width||0}px`);
        this._imgDom.attr("height",`${height||0}px`);
        this._src = "";
        this._html = $(`<span></span>`);
        this._contextCan=null;
        this._image=null;
        if(!width){
            this._widthSetted = false;
        }
        if(!height){
            this._heightSetted = false;
        }
        
        this._html.append(this._imgDom);
        this._bindEvent();
    }

    _bindEvent(){
        this._imgDom.on("click",function(ev){
            // console.log(ev);
        });

    }
    getPixelData(x,y){
        if(this._contextCan!=null&&this._image.complete==true){
            return contextCan.getImageDate(x,y,1,1);
        }else{
            return null;
        }
    }
    _drawImageSource(){
        if(this._src && this._src !== ""){
            this._image = new Image();
            let canvasDes = document.createElement("canvas");
            this._image.onload = function(){
                if(!this._widthSetted){
                    canvasDes.attr("width",this._width+"px");
                }
                if (!_this._heightSetted){
                    canvasDes.attr("height",this._height+"px");
                }
                console.log("width is:",this._width," height is:",this._height);
                this._contextCan = canvasDes[0].getContext("2d");
            }
        }
    }

    reflexPropSelf(child,reflex){
        console.log("child is:::",child);
        let width = utils.Dom.getAttr(child,"showWidth");
        if(width && width !== ""){
            this._widthSetted = true;
            this._imgDom.attr("width",width);
        }

        let height = utils.Dom.getAttr(child,"showHeight");
        if(height && height !== ""){
            this._heightSetted = true;
            this._imgDom.attr("height",height);
        }

        let src = utils.Dom.getAttr(child,"showSrc");
        this._imgDom.attr("src",src);
    }

    get showSrc(){
        return this._imgDom.attr("src");
    }

    set showSrc(src){
        this._src = src;
        this._imgDom.attr("src",src);
        this._drawImageSource();
    }

    get showWidth(){
        return this._imgDom.attr("width");
    }

    set showWidth(width){
        this._width = width;
        this._widthSetted = true;
        this._imgDom.attr("width",width);
    }

    get showHeight(){
        return this._imgDom.attr("height");
    }

    set showHeight(height){
        this._height = height;
        this._heightSetted = true;
        this._imgDom.attr("height",height);
    }
    
    destroySelfEvent(){
        this._inputDom.off("click");
    }

    destroySelfProp(){
        this._width = null;
        this._height = null;
        this._src = null;
        this._widthSetted=null;
        this._heightSetted=null;
        this._imgDom=null;
        this._contextCan=null;
        this._image=null;
    }


}   