$(function () {
    $(".editor-mask").hide();
    const fileInfo = {
        id: "1001",
        name: "测试文件",
        author: "superman",
    }
    EditorDocs.init(WebUIControl);
    EditorDocs.new(fileInfo);
});

//编辑器前段UI接口
WebUIControlIf = {
    domid: undefined,
    scrollid: undefined,
    init: function () { },
    synchroData: function () { },
    synchroStyle: function (textStyle, paragStyle) { },
    synchroStack: function (len, poi) { },
    showContextMenu: function (opt) { },
    showMessage: function (msg, title) { },
    showMask: function (visible) { },
}

WebUIControl = {
    domid: document.getElementById("i-editor-dom"),
    scrollid: document.getElementById("i-editor-scroll"),
    textStyle: {},
    paragStyle: {},
    init: function () {
        this.domid = document.getElementById("panel-editor-domid")
        this.scrollid = document.getElementById("panel-scroll")
        this.initUI()
        this.initEvent()
    },
    initUI: function () {
        WebUIControl.createTableUI()
        WebUIControl.createColorUI()
        WebUIControl.createDateUI()
        WebUIControl.createGraphicCodeUI()
        WebUIControl.createPaperSizeUI()
        WebUIControl.createPaperOrientationUI()
        WebUIControl.createPaperMarginUI()
        WebUIControl.createSignatureUI()
        WebUIControl.createShapeUI()
        WebUIControl.createWatermarkUI()
        WebUIControl.createPageNumberUI()
        WebUIControl.createDividerUI()
        WebUIControl.createFormulaUI()
    },
    initEvent: function () {
        $("#editor-menu-bar").tabs({
            onSelect: function () {
                EditorDocs.refresh()
            }
        })
        /**
         * 文件页签菜单开始
         */
        $("#file-download").linkbutton({
            onClick: () => {
                EditorDocs.fileDownload()
            }
        });
        $("#file-imp").linkbutton({
            onClick: () => {
                $("#input-file").click();
            }
        });
        $("#file-save").linkbutton({
            onClick: () => {

            }
        });
        $("#file-print").linkbutton({
            onClick: () => {

            }
        });
        /**
         * 文件页签菜单结束
         */
        /**
         * 开始页签菜单开始
         */
        $("#board-paste").linkbutton({
            onClick: () => {
                EditorDocs.pasteText()
            }
        });
        $("#board-copy").linkbutton({
            onClick: () => {
                EditorDocs.copyText()
            }
        });
        $("#board-cut").linkbutton({
            onClick: () => {
                EditorDocs.cutText()
            }
        });
        $("#stack-prev").linkbutton({
            disabled: true,
            onClick: () => {
                EditorDocs.prevStack()
            }
        })
        $("#stack-next").linkbutton({
            disabled: true,
            onClick: () => {
                EditorDocs.nextStack()
            }
        })
        $('#font-size').combobox({
            data: EditorDocs.getFontSizeList(),
            valueField: 'value',
            textField: 'name',
            editable: false,
            onSelect: (record) => {
                if (WebUIControl.textStyle.size) {
                    WebUIControl.textStyle.size = record.value
                    EditorDocs.changeTextStyle({ size: record.value })
                    EditorDocs.refresh()
                }
            }
        });
        $('#font-family').combobox({
            data: EditorDocs.getFontFamilyList(),
            valueField: 'value',
            textField: 'name',
            editable: false,
            onSelect: (record) => {
                if (WebUIControl.textStyle.font) {
                    WebUIControl.textStyle.font = record.value
                    EditorDocs.changeTextStyle({ font: record.value })
                    EditorDocs.refresh()
                }
            }
        });
        $("#font-size-in").linkbutton({
            onClick: () => {
                const list = EditorDocs.getFontSizeList()
                const index = list.findIndex(item => item.value <= WebUIControl.textStyle.size)
                if (index > 0) {
                    $('#font-size').combobox("setValue", list[index - 1].value)
                } else {
                    EditorDocs.refresh()
                }
            }
        });
        $("#font-size-de").linkbutton({
            onClick: () => {
                const list = EditorDocs.getFontSizeList()
                const index = list.findIndex(item => item.value <= WebUIControl.textStyle.size)
                if (index >= 0 && index < list.length - 1) {
                    $('#font-size').combobox("setValue", list[index + 1].value)
                } else {
                    EditorDocs.refresh()
                }
            }
        });
        $("#font-bold").linkbutton({
            onClick: () => {
                WebUIControl.textStyle.bold = !WebUIControl.textStyle.bold
                EditorDocs.changeTextStyle({ bold: WebUIControl.textStyle.bold })
            }
        });

        $("#font-italic").linkbutton({
            onClick: () => {
                WebUIControl.textStyle.italic = !WebUIControl.textStyle.italic
                EditorDocs.changeTextStyle({ italic: WebUIControl.textStyle.italic })
            }
        });

        $("#font-underline").linkbutton({
            onClick: () => {
                WebUIControl.textStyle.underline = !WebUIControl.textStyle.underline
                EditorDocs.changeTextStyle({ underline: WebUIControl.textStyle.underline })
            }
        });

        $("#font-strikethrough").linkbutton({
            onClick: () => {
                WebUIControl.textStyle.strikethrough = !WebUIControl.textStyle.strikethrough
                EditorDocs.changeTextStyle({ strikethrough: WebUIControl.textStyle.strikethrough })
            }
        });

        $("#font-script-sub").linkbutton({
            onClick: () => {
                if (WebUIControl.textStyle.script == 'sub') {
                    WebUIControl.textStyle.script = 'nor'
                    $("#font-script-sup").linkbutton("unselect")
                } else {
                    WebUIControl.textStyle.script = 'sub'
                }
                EditorDocs.changeTextStyle({ script: WebUIControl.textStyle.script })
            }
        });

        $("#font-script-sup").linkbutton({
            onClick: () => {
                if (WebUIControl.textStyle.script == 'sup') {
                    WebUIControl.textStyle.script = 'nor'
                    $("#font-script-sub").linkbutton("unselect")
                } else {
                    WebUIControl.textStyle.script = 'sup'
                }
                EditorDocs.changeTextStyle({ script: WebUIControl.textStyle.script })
            }
        });

        $("#font-align-left").linkbutton({
            onClick: () => {
                EditorDocs.changeParagStyle({ align: "left" })
            }
        });

        $("#font-align-center").linkbutton({
            onClick: () => {
                EditorDocs.changeParagStyle({ align: "center" })
            }
        });

        $("#font-align-right").linkbutton({
            onClick: () => {
                EditorDocs.changeParagStyle({ align: "right" })
            }
        });

        $("#font-align-both").linkbutton({
            onClick: () => {
                EditorDocs.changeParagStyle({ align: "both" })
            }
        });

        $("#font-align-dispersed").linkbutton({
            onClick: () => {
                EditorDocs.changeParagStyle({ align: "dispersed" })
            }
        });
        $("#parag-indent-sub").linkbutton({
            onClick: () => {
                const style = EditorDocs.getParagStyle()
                EditorDocs.changeParagStyle({ indentLeft: Math.max(0, style.indentLeft - 0.5) })
            }
        });
        $("#parag-indent-add").linkbutton({
            onClick: () => {
                const style = EditorDocs.getParagStyle()
                EditorDocs.changeParagStyle({ indentLeft: style.indentLeft + 0.5 })
            }
        });
        $("#parag-find").linkbutton({
            onClick: () => {

            }
        });
        $("#parag-replace").linkbutton({
            onClick: () => {

            }
        });

        $("#insert-image").linkbutton({
            onClick: () => {
                $("#input-image").click();
            }
        });
        $("#insert-symbol").linkbutton({
            onClick: () => {
                WebUIControl.symbolInsert()
            }
        });
        $("#mm_date").menu({
            onShow: () => {
                const now = new Date()
                $("div[data-event='insert-date']").each(function (index, item) {
                    $('#mm_date').menu('setText', {
                        target: $(item),
                        text: now.pattern($(item).data("format"))
                    });
                })
            },
            onClick: (item) => {
                const format = $(item.target).data("format")
                const now = new Date()
                EditorDocs.insertDate(now, format)
            }
        });

        /**
         * 开始页签菜单结束
         */
        /**
         * 页面页签菜单开始
         */
        /**
         * 页面页签菜单开始
         */
        /**
         * 帮助页签菜单结束
         */
        $("#help-about").linkbutton({
            onClick: () => {
                WebUIControl.helpAbout()
            }
        });
        /**
         * 帮助页签菜单结束
         */

        /**
         * 状态栏开始
         */
        $("#status-full").linkbutton({
            onClick: () => {
                const isFullScreen = document.fullscreenElement
                if (isFullScreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen()
                    }
                    $('#status-full').linkbutton({
                        iconCls: 'icon-edt-full'
                    });
                } else {
                    const element = document.documentElement; // 获取整个文档的元素
                    if (element.requestFullscreen) { // 标准写法
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) { // Firefox 浏览器
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) { // Chrome 和 Safari
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) { // IE11
                        element.msRequestFullscreen();
                    }
                    $('#status-full').linkbutton({
                        iconCls: 'icon-edt-full-exit'
                    });
                }
            }
        });

        //缩放滑块
        $("#status-zoom-slider").on("input", function () {
            const list = EditorDocs.getZoomScaleList()
            const value = list[$(this).val()]
            $("#status-zoom-show").html(parseInt(value * 100) + "%")
            EditorDocs.setZoom(value)
        });

        //缩放减按钮
        $("#status-ratio-down").linkbutton({
            onClick: function () {
                const list = EditorDocs.getZoomScaleList()
                const ratio = EditorDocs.getZoomRatio();
                for (let index = list.length - 1; index >= 0; index--) {
                    const value = list[index];
                    if (value < ratio) {
                        $("#status-zoom-show").html(parseInt(value * 100) + "%")
                        $("#status-zoom-slider").val(index)
                        EditorDocs.setZoom(value)
                        break;
                    }
                }
            }
        })

        //缩放加按钮
        $("#status-ratio-up").linkbutton({
            onClick: function () {
                const list = EditorDocs.getZoomScaleList()
                const ratio = EditorDocs.getZoomRatio();
                for (let index = 0; index < list.length; index++) {
                    const value = list[index];
                    if (value > ratio) {
                        $("#status-zoom-show").html(parseInt(value * 100) + "%")
                        $("#status-zoom-slider").val(index)
                        EditorDocs.setZoom(value)
                        break;
                    }
                }
            }
        })

        //最佳显示比例
        $("#status-scale").linkbutton({
            onClick: function () {
                const list = EditorDocs.getWaterMarkFontSizeList()
                const size = EditorDocs.getViewSize().width
                const outsize = $("#panel-editor-domid").width() - 20
                const ratio = Math.floor((outsize / size) * 100) / 100
                EditorDocs.setZoom(ratio)

                $("#status-zoom-show").html(parseInt(ratio * 100) + "%")
                for (let index = list.length - 1; index >= 0; index--) {
                    const value = list[index];
                    if (value < ratio) {
                        $("#status-zoom-slider").val(index)
                        break;
                    }
                }
            }
        })
        /**
         * 状态栏结束
         */

        /**
         * 上下文菜单开始
         */
        $("#mm_content").menu({
            onClick: (item) => {
                if (item.event == 'paragraph') {
                    WebUIControl.paragraphInfo()
                } else if (item.event == 'copy') {
                    EditorDocs.copyText()
                } else if (item.event == 'paste') {
                    EditorDocs.pasteText()
                } else if (item.event == 'symbol') {
                    WebUIControl.symbolInsert()
                } else if (item.event == 'image-change') {

                } else if (item.event == 'code-modify') {

                } else if (item.event == "table-insert-row-above") {
                    EditorDocs.tableInsertRowAbove()
                } else if (item.event == "table-insert-row-below") {
                    EditorDocs.tableInsertRowBelow()
                } else if (item.event == "table-insert-col-left") {
                    EditorDocs.tableInsertColLeft()
                } else if (item.event == "table-insert-col-right") {
                    EditorDocs.tableInsertColRight()
                } else if (item.event == "table-merge") {
                    EditorDocs.tableMerge()
                } else if (item.event == "table-split") {
                    WebUIControl.tableSplitInfo()
                } else if (item.event == "table-delete-cell") {
                    WebUIControl.tableDeleteInfo()
                } else if (item.event == "table-delete-row") {
                    EditorDocs.tableDeleteRow()
                } else if (item.event == "table-delete-col") {
                    EditorDocs.tableDeleteCol()
                } else if (item.event == "table-delete") {
                    EditorDocs.tableDelete()
                } else if (item.event == "table-border") {

                } else if (item.event == "table-property") {

                }
            }
        })
        /**
         * 上下文菜单结束
         */
        $("#input-image").change(() => {
            //获取读取我文件的File对象
            const selectedFile = document.getElementById('input-image').files[0];
            //const name = selectedFile.name;//读取选中文件的文件名
            //const size = selectedFile.size;//读取选中文件的大小
            const reader = new FileReader();//这是核心,读取操作就是由它完成.
            reader.onload = () => {
                $("#input-image").val("")
                if (reader.readyState == 2) {
                    EditorDocs.insertImage(reader.result)
                }
            }
            reader.readAsDataURL(selectedFile);
        })
        $("#input-file").change(() => {
            //获取读取我文件的File对象
            const selectedFile = document.getElementById('input-file').files[0];
            //const name = selectedFile.name;//读取选中文件的文件名
            //const size = selectedFile.size;//读取选中文件的大小
            const reader = new FileReader();//这是核心,读取操作就是由它完成.
            reader.onload = () => {
                $("#input-file").val("")
                if (reader.readyState == 2) {
                    EditorDocs.fileImport(reader.result)
                }
            }
            reader.readAsText(selectedFile);
        })
    },
    synchroStyle: function (textStyle, paragStyle) {
        $('#font-family').combobox("setValue", textStyle.font)
        $('#font-size').combobox("setValue", textStyle.size)
        $("#font-color").css("color", textStyle.color)

        $("#font-bold").linkbutton(textStyle.bold ? "select" : "unselect")
        $("#font-underline").linkbutton(textStyle.underline ? "select" : "unselect")
        $("#font-strikethrough").linkbutton(textStyle.strikethrough ? "select" : "unselect")

        $("#font-script-sub").linkbutton(textStyle.script == "sub" ? "select" : "unselect")
        $("#font-script-sup").linkbutton(textStyle.script == "sup" ? "select" : "unselect")

        $("#font-align-left").linkbutton("left" == paragStyle.align ? "select" : "unselect")
        $("#font-align-center").linkbutton("center" == paragStyle.align ? "select" : "unselect")
        $("#font-align-right").linkbutton("right" == paragStyle.align ? "select" : "unselect")
        $("#font-align-both").linkbutton("both" == paragStyle.align ? "select" : "unselect")
        $("#font-align-dispersed").linkbutton("dispersed" == paragStyle.align ? "select" : "unselect")

        $("div[data-style='rowspac']").each((index, item) => {
            let iconCls = ""
            if ($(item).data("val") == paragStyle.rowspac) {
                iconCls = 'icon-ok'
            }

            $("#mm_rowspac").menu('setIcon', {
                target: item,
                iconCls: iconCls
            });
        })
        WebUIControl.textStyle = textStyle
        WebUIControl.paragStyle = paragStyle
    },
    synchroStack: function (len, poi) {
        $("#stack-prev").linkbutton(len > 1 ? "enable" : "disable")
        $("#stack-next").linkbutton(poi > 0 ? "enable" : "disable")
    },
    synchroData: function () {
        WebUIControl.loadUsedColors()
    },
    showMask: function (visible, msg) {
        if (visible) {
            $(".progress-state").html(msg)
            $(".editor-progress").show();
        } else {
            $(".editor-progress").hide();
        }
    },
    showContextMenu: function (opt) {
        opt.copy ? WebUIControl.enableItem("复制") : WebUIControl.disableItem("复制")
        opt.table ? WebUIControl.showItem("表格") : WebUIControl.hideItem("表格")
        opt.tableMerge ? WebUIControl.showItem("合并单元格") : WebUIControl.hideItem("合并单元格")
        opt.tableSplit ? WebUIControl.showItem("拆分单元格") : WebUIControl.hideItem("拆分单元格")
        opt.tableDeleteCol ? WebUIControl.showItem("删除列") : WebUIControl.hideItem("删除列")
        opt.tableDeleteRow ? WebUIControl.showItem("删除行") : WebUIControl.hideItem("删除行")
        opt.tableDeleteCell ? WebUIControl.showItem("删除单元格") : WebUIControl.hideItem("删除单元格")
        opt.tableDelete ? WebUIControl.showItem("删除表格") : WebUIControl.hideItem("删除表格")
        $('#mm_content').menu('show', {
            left: opt.pageX,
            top: opt.pageY,
        });
    },
    showMessage: function (msg, title) {
        $.messager.show({ title: title, msg: msg, timeout: 1000, showType: 'slide' });
    },
    enableItem: function (key, visible) {
        const item = $('#mm_content').menu('findItem', key);
        $('#mm_content').menu('enableItem', item.target);
    },
    disableItem: function (key, visible) {
        const item = $('#mm_content').menu('findItem', key);
        $('#mm_content').menu('disableItem', item.target);
    },
    showItem: function (key, visible) {
        const item = $('#mm_content').menu('findItem', key);
        $('#mm_content').menu('showItem', item.target);
    },
    hideItem: function (key, visible) {
        const item = $('#mm_content').menu('findItem', key);
        $('#mm_content').menu('hideItem', item.target);
    },

    paragraphInfo: function () {
        WebUIControl.createDlg({
            title: '段落',
            width: 400,
            height: 400,
            href: './core/form/paragraphForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    const style = {
                        align: $("#form-p-align").combobox("getValue"),
                        rowspac: $("#form-row-space").combobox("getValue"),
                        indentSpecialType: $("#form-indent-other").combobox("getValue"),
                        indentSpecialvalue: $("#form-indent-value").numberspinner("getValue") * 1,
                        indentLeft: $("#form-indent-left").numberspinner("getValue") * 1,
                        indentRight: $("#form-indent-right").numberspinner("getValue") * 1,
                        segmentSpacAft: $("#form-space-aft").numberspinner("getValue") * 1,
                        segmentSpacPre: $("#form-space-pre").numberspinner("getValue") * 1,
                    }
                    EditorDocs.changeParagStyle(style)
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                const style = EditorDocs.getParagStyle()
                $("#form-p-align").combobox({
                    data: EditorDocs.getParagAlignList(),
                    valueField: 'value',
                    textField: 'label',
                    editable: false,
                    value: style.align,
                    panelHeight: 170,
                });
                $("#form-indent-other").combobox({
                    data: EditorDocs.getParagIndentList(),
                    valueField: 'value',
                    textField: 'label',
                    editable: false,
                    panelHeight: 120,
                    value: style.indentSpecialType,
                });
                $("#form-row-space").combobox({
                    data: EditorDocs.getParagSpaceList(),
                    valueField: 'value',
                    textField: 'label',
                    editable: false,
                    panelHeight: 120,
                    value: style.rowspac,
                });
                const numberconfig = { min: 0, max: 20, suffix: '字符', value: 0, increment: 0.5, precision: 1, }
                $("#form-indent-value").numberspinner(Object.assign({}, numberconfig, { value: style.indentSpecialvalue }));
                $("#form-indent-left").numberspinner(Object.assign({}, numberconfig, { value: style.indentLeft }));
                $("#form-indent-right").numberspinner(Object.assign({}, numberconfig, { value: style.indentRight }));
                $("#form-space-pre").numberspinner(Object.assign({}, numberconfig, { value: style.segmentSpacPre }));
                $("#form-space-aft").numberspinner(Object.assign({}, numberconfig, { value: style.segmentSpacAft }));
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    symbolInsert: function () {
        WebUIControl.createDlg({
            title: '插入特殊字符',
            width: 620,
            height: 330,
            href: './core/form/symbolForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                const sylist = EditorDocs.getSymbolList()
                const mat = [
                    { show: 'form-sy-ts', value: sylist[0] },
                    { show: 'form-sy-bd', value: sylist[1] },
                    { show: 'form-sy-py', value: sylist[2] },
                    { show: 'form-sy-xh', value: sylist[3] },
                    { show: 'form-sy-dw', value: sylist[4] },
                    { show: 'form-sy-xl', value: sylist[5] },
                ]

                mat.forEach(item => {
                    if ($(`#${item.show}`).html().length == 0) {
                        const arr = item.value.split(';')
                        arr.forEach(str => {
                            const bdarr = str.split(',')
                            const panel = $(`<div class="symbolPanel"></div>`)
                            bdarr.forEach(sy => {
                                const sym = String.fromCharCode.apply(this, sy.split("-"))
                                panel.append(`<div class="symbolCell" data-value="${sy}">${sym}</div>`)
                            })
                            $(`#${item.show}`).append(panel)
                        })
                    }
                })
                $(".symbolCell").click((e) => {
                    const code = $(e.target).data("value") + ""
                    const sym = String.fromCharCode.apply(this, code.split("-"))
                    EditorDocs.insertWord(sym)
                })
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    menstHyInsert: function () {
        const now = new Date().pattern("yyyy-MM-dd")
        const mhty = EditorDocs.getMenstrualTypeList()
        WebUIControl.createDlg({
            title: '月经史表达式',
            width: 620,
            height: 180,
            href: './core/form/menstHyInsert.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                $("#form-menst-1").numberspinner({
                    min: 8,
                    max: 100,
                    value: 12,
                    suffix: '岁',
                })
                $("#form-menst-2").numberspinner({
                    min: 0,
                    max: 100,
                    value: 5,
                    suffix: '天',
                })
                $("#form-menst-3").numberspinner({
                    min: 0,
                    max: 100,
                    value: 6,
                    suffix: '天',
                })
                $("#form-menst-4").numberspinner({
                    min: 0,
                    max: 100,
                    value: 28,
                    suffix: '天',
                })
                $("#form-menst-5").numberspinner({
                    min: 0,
                    max: 100,
                    value: 30,
                    suffix: '天',
                })
                $("#form-menst-6").datebox({
                    value: now,
                })
                $("#form-menst-7").combobox({
                    valueField: 'id',
                    textField: 'text',
                    data: mhty,
                    value: 0,
                    editable: false,
                })
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    toothDmInsert: function () {
        WebUIControl.createDlg({
            title: '牙位图表达式',
            width: 610,
            height: 460,
            href: './core/form/toothDmInsert.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    fetalHtInsert: function () {
        WebUIControl.createDlg({
            title: '胎心位置表达式',
            width: 180,
            height: 220,
            href: './core/form/fetalHtInsert.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    tableSplitInfo: function () {
        const info = EditorDocs.tableCellInfo()
        WebUIControl.createDlg({
            title: '拆分单元格',
            width: 200,
            height: 180,
            href: './core/form/tableCellSplit.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    const splitdata = {
                        rows: parseInt($('#form-table-split-rows').numberspinner("getValue")),
                        cols: parseInt($('#form-table-split-cols').numberspinner("getValue"))
                    }
                    EditorDocs.tableSplit(splitdata)
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                let maxrow = 10, rowinc = 1, rowval = 1, maxcol = 10, colinc = 1, colval = 2
                if (info.rows > 0) {
                    maxrow = info.rows + 1
                    rowinc = info.rows
                }
                if (info.cols > 0) {
                    maxcol = info.cols + 1
                    colinc = info.cols
                    colval = info.cols + 1
                }
                $('#form-table-split-rows').numberspinner({ min: 1, max: maxrow, value: rowval, increment: rowinc, });
                $('#form-table-split-cols').numberspinner({ min: 1, max: maxcol, value: colval, increment: colinc, });
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    tableDeleteInfo: function () {
        WebUIControl.createDlg({
            title: '删除单元格',
            width: 200,
            height: 180,
            href: './core/form/tableDeleteForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    const val = $('#form-table-delete-option').radiogroup("getValue")
                    EditorDocs.tableDeleteCell(val)
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                $('#form-table-delete-option').radiogroup({
                    name: 'option',
                    value: 'col',
                    data: [{ "value": "col", "label": "删除整列" }, { "value": "row", "label": "删除整行" }],
                    dir: "v",
                });
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    pageSizeSet: function () {
        const content = EditorDocs.getPaperInfo()
        WebUIControl.createDlg({
            title: '设置纸张',
            width: 400,
            height: 400,
            href: './core/form/pageSetForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    content.width = $("#form-page-width").numberspinner("getValue") * 100
                    content.height = $("#form-page-height").numberspinner("getValue") * 100
                    content.type = $("#form-page-type").combobox("getValue")
                    content.direction = $("#form-page-direction").combobox("getValue")

                    content.top = $("#form-page-padding-top").numberspinner("getValue") * 100
                    content.bottom = $("#form-page-padding-bottom").numberspinner("getValue") * 100
                    content.left = $("#form-page-padding-left").numberspinner("getValue") * 100
                    content.right = $("#form-page-padding-right").numberspinner("getValue") * 100
                    EditorDocs.setPaperInfo(content)
                    WebUIControl.loadPaperSize()
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                const paperTypeList = EditorDocs.getPaperTypeList()
                const paperDirecList = EditorDocs.getPaperDirecList()
                $("#form-page-width").numberspinner({
                    min: 0,
                    max: 9999999,
                    suffix: 'mm',
                    value: content.widht / 100,
                })
                $("#form-page-height").numberspinner({
                    min: 0,
                    max: 9999999,
                    suffix: 'mm',
                    value: content.height / 100,
                })
                $("#form-page-type").combobox({
                    data: paperTypeList,
                    valueField: 'value',
                    textField: 'name',
                    editable: false,
                    panelHeight: 120,
                    value: content.type,
                    onSelect: (record) => {
                        if (record.standard) {
                            $("#form-page-width").numberspinner("setValue", record.width / 100)
                            $("#form-page-height").numberspinner("setValue", record.height / 100)
                            $("#form-page-width").numberspinner("disable")
                            $("#form-page-height").numberspinner("disable")
                        } else {
                            $("#form-page-width").numberspinner("enable")
                            $("#form-page-height").numberspinner("enable")
                        }
                    }
                });
                $("#form-page-direction").combobox({
                    data: paperDirecList,
                    valueField: 'value',
                    textField: 'name',
                    editable: false,
                    panelHeight: 120,
                    value: content.direction,
                    onChange: () => {
                        const width = $("#form-page-width").numberspinner("getValue")
                        const height = $("#form-page-height").numberspinner("getValue")
                        $("#form-page-width").numberspinner("setValue", height)
                        $("#form-page-height").numberspinner("setValue", width)
                    }
                });
                $("#form-page-padding-top").numberspinner({
                    min: 0,
                    max: 50,
                    suffix: 'mm',
                    value: content.top / 100,
                })
                $("#form-page-padding-bottom").numberspinner({
                    min: 0,
                    max: 50,
                    suffix: 'mm',
                    value: content.bottom / 100,
                })
                $("#form-page-padding-left").numberspinner({
                    min: 0,
                    max: 50,
                    suffix: 'mm',
                    value: content.left / 100,
                })
                $("#form-page-padding-right").numberspinner({
                    min: 0,
                    max: 50,
                    suffix: 'mm',
                    value: content.right / 100,
                })

            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    pageNumSet: function () {
        const alignlist = EditorDocs.getPageNumAlignList()
        const typelist = EditorDocs.getPageNumPatternList()
        const paper = EditorDocs.getPaperInfo()
        WebUIControl.createDlg({
            title: '设置页码',
            width: 300,
            height: 180,
            href: './core/form/pageNumForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    const result = {
                        pageNumPattern: $("#form-page-num-pattern").combobox("getValue"),
                        pageNumAlign: $("#form-page-num-align").combobox("getValue"),
                    }
                    EditorDocs.insertPageNumber(result)
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                $('#form-page-num-pattern').combobox({
                    data: typelist,
                    valueField: 'value',
                    textField: 'name',
                    editable: true,
                    panelHeight: 140,
                    value: paper.pageNumPattern,
                })
                $("#form-page-num-align").combobox({
                    data: alignlist,
                    valueField: 'value',
                    textField: 'label',
                    editable: false,
                    panelHeight: 120,
                    value: paper.pageNumAlign,
                });
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    helpAbout: function () {
        const content = EditorDocs.getPaperInfo()
        WebUIControl.createDlg({
            title: '关于编辑器',
            width: 400,
            height: 400,
            href: './core/form/helpAboutForm.html',
            buttons: [{
                text: '确定',
                handler: () => {

                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {

            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },

    colorPalette: function () {
        const arr = EditorDocs.colorTool("h16ToInt", EditorDocs.getTextStyle().color)
        WebUIControl.createDlg({
            title: '颜色选择',
            width: 360,
            height: 300,
            href: './core/form/colorPaletteForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    const color = $("#form-color-res").data("color")
                    $("#font-color").css("color", color)
                    EditorDocs.changeFontColor(color)
                    WebUIControl.loadUsedColors()
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                const setCurrColor = function () {
                    const curr = EditorDocs.colorTool("intToH16", arr)
                    $("#form-color-res").css("background-color", curr)
                    $("#form-color-res").data("color", curr)
                }
                $("#form-color-r").slider({
                    showTip: true,
                    min: 0,
                    max: 255,
                    value: arr[0],
                    onChange: function (newValue) {
                        arr[0] = newValue
                        setCurrColor()
                    }
                })
                $("#form-color-g").slider({
                    showTip: true,
                    min: 0,
                    max: 255,
                    value: arr[1],
                    onChange: function (newValue) {
                        arr[1] = newValue
                        setCurrColor()
                    }
                })
                $("#form-color-b").slider({
                    showTip: true,
                    min: 0,
                    max: 255,
                    value: arr[2],
                    onChange: function (newValue) {
                        arr[2] = newValue
                        setCurrColor()
                    }
                })
                setCurrColor()
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    inputSignature: function () {
        WebUIControl.createDlg({
            title: '创建新签名',
            width: 435,
            height: 310,
            href: './core/form/inputSignatureForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    const base64 = EditorDocs.getSignature()
                    EditorDocs.insertSignature(base64)
                    EditorDocs.cancelSignature()
                    WebUIControl.closeDlg()
                }
            }, {
                text: '关闭',
                handler: () => { EditorDocs.cancelSignature(); WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                EditorDocs.registerSignature({ signatureid: "form-signature-cvs" })
            },
            onClose: () => {
                EditorDocs.cancelSignature()
                WebUIControl.closeDlg()
            }
        })
    },
    editWatermark: function () {
        const opt = {
            text: "",
            style: "0",
            transparency: 30,
            fontfamily: "SimSun",
            fontsize: 2000,
        }
        WebUIControl.createDlg({
            title: '编辑水印',
            width: 450,
            height: 350,
            href: './core/form/watermarkForm.html',
            buttons: [{
                text: '确定',
                handler: () => {
                    if (EditorDocs.stringTool("isNotBlank", opt.text)) {
                        EditorDocs.insertWatermark('cutsom', opt)
                        WebUIControl.closeDlg()
                    } else {
                        $.messager.alert('警告', '水印文本内容必须填写!', 'warning', () => {
                            $('#form-watermark-text').combobox("textbox").focus();
                        });
                    }
                }
            }, {
                text: '关闭',
                handler: () => { WebUIControl.closeDlg() }
            }],
            onLoad: () => {
                const canvas = document.getElementById("form-watermark-canvas")
                const preview = () => {
                    EditorDocs.canvasTool(canvas, "drawWaterMark", opt)
                }
                const examples = [
                    { name: '严禁复制', value: '严禁复制' },
                    { name: '保密', value: '保密' },
                    { name: '绝密', value: '绝密' },
                    { name: '传阅', value: '传阅' },
                    { name: '紧急', value: '紧急' },
                    { name: '样本', value: '样本' },
                    { name: '原稿', value: '原稿' },
                    { name: '草稿', value: '草稿' },
                ]

                $('#form-watermark-text').combobox({
                    data: examples,
                    valueField: 'value',
                    textField: 'name',
                    panelHeight: 160,
                    onChange: () => {
                        opt.text = $('#form-watermark-text').combobox("getText")
                        preview()
                    },
                })
                $("#form-watermark-family").combobox({
                    data: EditorDocs.getFontFamilyList(),
                    valueField: 'value',
                    textField: 'name',
                    value: opt.fontfamily,
                    onSelect: (item) => {
                        opt.fontfamily = item.value
                        preview()
                    }
                })
                $('#form-watermark-size').combobox({
                    data: EditorDocs.getWaterMarkFontSizeList(),
                    valueField: 'value',
                    textField: 'name',
                    value: opt.fontsize,
                    panelHeight: 160,
                    editable: false,
                    onSelect: (item) => {
                        opt.fontsize = item.value
                        preview()
                    }
                });

                $('#form-watermark-transparency').slider({
                    min: 0,
                    max: 100,
                    value: opt.transparency,
                    onChange: (val) => {
                        opt.transparency = val
                        preview()
                    },
                })
                $("#form-watermark-style-0").linkbutton({
                    toggle: true,
                    group: 'form-watermark-style',
                    plain: true,
                    selected: true,
                    onClick: () => {
                        opt.style = 0
                        preview()
                    }
                })
                $("#form-watermark-style-1").linkbutton({
                    toggle: true,
                    group: 'form-watermark-style',
                    plain: true,
                    onClick: () => {
                        opt.style = 1
                        preview()
                    }
                })
            },
            onClose: () => {
                WebUIControl.closeDlg()
            }
        })
    },
    loadUsedColors: function () {
        const colors = EditorDocs.getUsedColors();
        $(".color-used").each(function (index, item) {
            if (index < colors.length) {
                $(item).css("background-color", colors[index])
                $(item).data("color", colors[index])
            }
        })
    },
    loadPaperSize: function () {
        const content = EditorDocs.getPaperInfo()
        $(".paper-list .list-item").each(function () {
            if ($(this).data("paper") == content.type) {
                $(this).addClass("selected")
            } else {
                $(this).removeClass("selected")
            }
        })
    },
    loadPaperOrientation: function () {
        const content = EditorDocs.getPaperInfo()
        $(".orientation-list .list-item").each(function () {
            if ($(this).data("paper") == content.direction) {
                $(this).addClass("selected")
            } else {
                $(this).removeClass("selected")
            }
        })
    },
    loadPaperMargin: function () {
        const content = EditorDocs.getPaperInfo()
        $(".margin-list .list-item").each(function () {
            if ($(this).data("lr") == content.left
                && $(this).data("lr") == content.right
                && $(this).data("tb") == content.top
                && $(this).data("tb") == content.bottom) {

                $(this).addClass("selected")
            } else {
                $(this).removeClass("selected")
            }
        })
    },
    createTableUI: function () {
        let html = "<table class='editor-table'>";
        for (let row = 1; row <= 10; row++) {
            html += "<tr>";
            for (let col = 1; col <= 10; col++) {
                html += "<td class='table-insert-cell' data-row='" + row + "' data-col='" + col + "'><div></div></td>";
            }
            html += "</tr>";
        }
        html += "</table>";
        $("#mm_table").html(html);
        $(".table-insert-cell").mouseenter(function () {
            const row = $(this).data("row");
            const col = $(this).data("col");
            $(".table-insert-cell").each(function () {
                const temprow = $(this).data("row");
                const tempcol = $(this).data("col");
                if (temprow <= row && tempcol <= col) {
                    $(this).addClass("selected")
                }
            })
        })
        $(".table-insert-cell").mouseleave(function () {
            $(".table-insert-cell").each(function () {
                $(this).removeClass("selected")
            })
        })
        $(".table-insert-cell").click(function () {
            const table = {
                rows: $(this).data("row"),
                cols: $(this).data("col"),
            }
            $("#mm_table").menu("hide")
            EditorDocs.insertTable(table)
        })
    },
    createColorUI: function () {
        $("#mm_color").load("./core/scene/colorPanel.html", function () {
            $(".editor-color .color-cell").click(function () {
                if ($(this).data("color")) {
                    $("#mm_color").menu("hide")
                    $("#font-color").css("color", $(this).data("color"))
                    EditorDocs.changeFontColor($(this).data("color"))
                    WebUIControl.loadUsedColors()
                }
            })

            $(".color-select-palette .color-other-set").linkbutton({
                onClick: function () {
                    $("#mm_color").menu("hide")
                    WebUIControl.colorPalette()
                }
            })
        });
    },
    createDateUI: function () {
        $("#mm_date").load("./core/scene/datePattern.html", function () {
            const datePatternList = EditorDocs.getDataPatternList()
            let html = "";
            const now = new Date()
            datePatternList.forEach(function (pt) {
                html += `<tr>
                            <td class="list-item" data-pattern="${pt}">
                                <div class="list-item-simgle">
                                    ${now.pattern(pt)}
                                </div>
                            </td>
                        </tr>`
            })
            $(".data-pattern-list").html(html)
        })
    },
    createGraphicCodeUI: function () {
        $("#mm_graphic_code").load("./core/scene/graphicCode.html", function () {
            $("#insert-barcode").click(function () {
                $("#mm_graphic_code").menu("hide")
                $.messager.prompt('输入', '请输入条码内容', function (value) {
                    if (EditorDocs.stringTool("isNotBlank", value)) {
                        EditorDocs.insertBarcode(value)
                    } else {
                        EditorDocs.refresh()
                    }
                });
            })

            $("#insert-qrcode").click(function () {
                $("#mm_graphic_code").menu("hide")
                $.messager.prompt('输入', '请输入二维码内容', function (value) {
                    if (EditorDocs.stringTool("isNotBlank", value)) {
                        EditorDocs.insertQrcode(value)
                    } else {
                        EditorDocs.refresh()
                    }
                });
            })
        })
    },
    createPaperSizeUI: function () {
        $("#mm_p_size").load("./core/scene/paperSize.html", function () {
            const paperTypeList = EditorDocs.getPaperTypeList()
            let html = "";
            paperTypeList.forEach(function (pt) {
                html += `<tr>
                            <td class="list-item" data-paper="${pt.value}">
                                <div class="list-item-name">
                                    ${pt.name}
                                </div>
                                <div class="list-item-desc">
                                    ${pt.width / 100}mm × ${pt.height / 100}mm
                                </div>
                            </td>
                        </tr>`
            })
            $(".paper-list").html(html)
            WebUIControl.loadPaperSize()
            $(".editor-list .paper-list .list-item").click(function () {
                EditorDocs.setPaperInfo({ type: $(this).data("paper") })
                WebUIControl.loadPaperSize()
            })
            $(".editor-list .paper-other-set").linkbutton({
                onClick: function () {
                    $("#mm_p_size").menu("hide")
                    WebUIControl.pageSizeSet()
                }
            })
        });
    },
    createPaperOrientationUI: function () {
        $("#mm_p_orientation").load("./core/scene/paperOrientation.html", function () {
            WebUIControl.loadPaperOrientation()
            $(".editor-list .orientation-list .list-item").click(function () {
                EditorDocs.setPaperInfo({ direction: $(this).data("paper") })
                WebUIControl.loadPaperOrientation()
            })
        })
    },
    createPaperMarginUI: function () {
        const paperMarginList = EditorDocs.getPaperMarginList()
        $("#mm_p_margin").load("./core/scene/paperMargin.html", function () {
            let html = "";
            paperMarginList.forEach(function (pt) {
                html += `<tr>
                                <td class="list-item" data-lr="${pt.leftRight}" data-tb="${pt.topBottom}">
                                    <div class="list-item-name">
                                        ${pt.name}
                                    </div>
                                    <div class="list-item-desc">
                                        上下:${pt.topBottom / 100}mm  左右:${pt.leftRight / 100}mm
                                    </div>
                                </td>
                            </tr>`
            })
            $(".margin-list").html(html)
            WebUIControl.loadPaperMargin()
            $(".editor-list .margin-list .list-item").click(function () {
                EditorDocs.setPaperInfo({
                    left: $(this).data("lr"),
                    right: $(this).data("lr"),
                    top: $(this).data("tb"),
                    bottom: $(this).data("tb"),
                })
                WebUIControl.loadPaperMargin()
            })
            $(".editor-list .margin-other-set").linkbutton({
                onClick: function () {
                    $("#mm_p_margin").menu("hide")
                    WebUIControl.pageSizeSet()
                }
            })
        })
    },
    createSignatureUI: function () {
        $("#mm_signature").load("./core/scene/signature.html", function () {
            $(".editor-list .signature-other-set").linkbutton({
                onClick: function () {
                    $("#mm_signature").menu("hide")
                    WebUIControl.inputSignature()
                }
            })
        })
    },
    createShapeUI: function () {
        $("#mm_shape").load("./core/scene/shapePanel.html", function () {
            $(".editor-list .shape-list .list-item").click(function () {
                EditorDocs.insertShape($(this).data("shape"))
            })
        })
    },
    createWatermarkUI: function () {
        $("#mm_watermark").load("./core/scene/watermarkPanel.html", function () {
            $(".editor-list .watermark-other-set").linkbutton({
                onClick: function () {
                    $("#mm_watermark").menu("hide")
                    EditorDocs.deleteWatermark()
                }
            })
            $(".editor-list .watermark-reserve").click(function () {
                $("#mm_watermark").menu("hide")
                EditorDocs.insertWatermark("reserve", $(this).data("watermark"))
            })
            $(".editor-list .watermark-custom").click(function () {
                $("#mm_watermark").menu("hide")
                WebUIControl.editWatermark()
            })
        })
    },
    createPageNumberUI: function () {
        $("#mm_pagenumber").load("./core/scene/pagenumberPanel.html", function () {
            $(".editor-list .pagenumber-other-set").linkbutton({
                onClick: function () {
                    $("#mm_pagenumber").menu("hide")
                    EditorDocs.detetePageNumber()
                }
            })
        })
    },
    createDividerUI: function () {
        $("#mm_divider").load("./core/scene/dividerPanel.html", function () {
            $(".divider-type").click(function () {
                $("#mm_divider").menu("hide")
                EditorDocs.insertDivder($(this).data("divider"))
            })
        })
    },
    createFormulaUI: function () {
        $("#mm_formula").load("./core/scene/formulaPanel.html", function () {
            $("#insert-menstrual-history").click(function () {
                $("#mm_formula").menu("hide")
                WebUIControl.menstHyInsert()
            })
            $("#insert-tooth-diagram").click(function () {
                $("#mm_formula").menu("hide")
                WebUIControl.toothDmInsert()
            })
            $("#insert-fetal-heart").click(function () {
                $("#mm_formula").menu("hide")
                WebUIControl.fetalHtInsert()
            })
        })
    },
    createDlg: function (opt) {
        const options = {
            title: '新建窗口',
            width: 400,
            height: 200,
            cache: false,
            modal: true,
            shadow: false,
            iconCls: 'icon-edt-logo',
            buttons: [{
                text: '关闭',
                handler: function () {
                    WebUIControl.closeDlg()
                }
            }],
            loadingMessage: '加载中...',
        }
        $.extend(options, opt);
        $("#dlg-list").append("<div id='dlg-list-1'></div>")
        $("#dlg-list-1").dialog(options);
    },
    closeDlg: function () {
        $("#dlg-list-1").dialog("destroy");
        $("#dlg-list").empty();
        EditorDocs.refresh()
    },
}