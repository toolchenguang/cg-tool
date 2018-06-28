/**
 * 工具类 一些基础的公共类方法
 * @author create by heshang
 * */
utils.Dom = class {
    /**
     *  将dom本身转换为html字符串
     *  @param node dom节点
     *
     * */
    static getOuterHtml(node) {
        var b = document.createElement("div");
        b.appendChild(node.cloneNode(true));
        return b.innerHTML;
    }

    /**
     *  将字符串转换为dom节点
     *  @param domstr html字符串
     * */
    static parseDom(domstr) {
        var b = document.createElement("div");
        b.innerHTML = domstr;
        return b.children;
    }

    /**
     *获取属性的value
     * */
    static getAttrValue(attr) {
        return attr.value;
    }

    /**
     * 獲取属性的nodeName
     * */
    static getAttrNodeName(attr) {
        return attr.nodeName;
    }

    /**
     * 根据key获取对应的属性
     * */
    static getBasic(tag, node, key) {
        let str = node.getAttribute(tag + key);
        // if (!base.reflex.debugger) {
        //     debugger;
        //     this.removeAttr(node, tag, key);
        // }
        return str ? str : "";
    }

    static getAttr(node, key) {
        return this.getBasic("data-", node, key);
    }

    static getEvt(node, key) {
        return this.getBasic("evt-", node, key);
    }

    static getEvl(node, key) {
        return this.getBasic("evl-", node, key);
    }

    /**
     * 删除对应的attr
     * */
    static removeAttr(child, tag, key) {
        child.removeAttribute(tag + key);
    }
}
utils.Href = class {
    static getQureryString(key, href) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        if (!href) {
            href = window.location.search;
        } else {
            href = "?" + href.split('?')[1];
        }
        var r = href.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }
}
utils.Ajax = class {
    static post(url, data, suc, error) {
        $.ajax({
            url: url,
            type: "post",
            data: data,
            dataType: "json",
            success: suc,
            error: error
        });
    }

    static postFormData(url, fd, suc, error) {
        $.ajax({
            url: url,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            success: suc,
            error: error
        });
    }

    static get(url, data, suc, error) {
        $.ajax({
            url: url,
            type: "get",
            data: data,
            dataType: "json",
            success: suc,
            error: error
        });
    }
}
