layui.use(function () {
    const fileInfo = {
        id: "1001",
        name: "测试文件",
        author: "superman",
    }
    EditorDocs.init(WebUIControl);
    EditorDocs.new(fileInfo);
});

WebUIControl = {
    domid: undefined,
    scrollid: undefined,
    init: function () {
        this.domid = document.getElementById("panel-editor-domid")
        this.scrollid = document.getElementById("panel-scroll")
        this.initUI()
        this.initEvent()
    },
    initUI: function () {
        layui.element.on('tab(menu-panel)', () => {
            EditorDocs.refresh()
        });
    },
    initEvent: function () {
        this.createFileMenu()
        this.createEditMenu()
        this.createFontMenu()
        this.createInsertMenu()
        this.createPageMenu()
        this.createHelpMenu()
        this.createStateBar()
        this.triggerFileLoad()
    },
    synchroData: function () { },
    synchroDocumentCount: function (pagecur, pagecou, charcou) {
        const $ = layui.$
        $("#status-page-info").html(`${pagecur}/${pagecou}`)
        $("#status-char-info").html(`字数:${charcou}`)
    },
    synchroStyle: function (textStyle, paragStyle) {
        layui.form.val('font-family-form-filter', { family: textStyle.font })
        layui.form.val('font-size-form-filter', { size: textStyle.size })
        layui.fontColor.setColor("#font-color", textStyle.color)
        layui.checkButton.selected("#font-bold", textStyle.bold)
        layui.checkButton.selected("#font-italic", textStyle.italic)
        layui.checkButton.selected("#font-underline", textStyle.underline)
        layui.checkButton.selected("#font-strikethrough", textStyle.strikethrough)
        layui.repelButton.selected("script", textStyle.script)
        layui.radioButton.selected("align", paragStyle.align)
        layui.menuButton.selected("rowspac", paragStyle.rowspac)
    },
    synchroStack: function (len, poi) {
        layui.linkButton.setEnable('#doc-undo', len > 1)
        layui.linkButton.setEnable('#doc-redo', poi > 0)
    },
    showContextMenu: function (opt) {
        const menuData = []
        if (opt.type == "0") {
            menuData.push({ title: '复制', id: '1', icon: 'layui-icon-copy', disabled: !opt.copy })
            menuData.push({ title: '粘贴', id: '2', icon: 'layui-icon-paste' })
            menuData.push({ type: '-' })
            const tableData = { title: '表格', type: 'parent', icon: 'layui-icon-table', child: [] }
            if (opt.table) menuData.push(tableData);
            menuData.push({ title: '段落', id: '3', icon: 'layui-icon-paragraph' })
            menuData.push({ title: '插入符号', id: '5', icon: 'layui-icon-omega' })
            menuData.push({ title: '更换图片', id: '6', icon: 'layui-icon-picture' })
            menuData.push({ title: '修改条码', id: '7', icon: 'layui-icon-code' })

            tableData.child.push({ title: '在上方插入行', id: '41', icon: 'layui-icon-table-above' })
            tableData.child.push({ title: '在下方插入行', id: '42', icon: 'layui-icon-table-below' })
            tableData.child.push({ type: '-' })
            tableData.child.push({ title: '在左侧插入列', id: '43', icon: 'layui-icon-table-left' })
            tableData.child.push({ title: '在右侧插入列', id: '44', icon: 'layui-icon-table-right' })
            tableData.child.push({ type: '-' })
            if (opt.tableMerge) tableData.child.push({ title: '合并单元格', id: '45', icon: 'layui-icon-table-merge' });
            if (opt.tableSplit) tableData.child.push({ title: '拆分单元格', id: '46', icon: 'layui-icon-table-split' });
            if (opt.tableDeleteCell) tableData.child.push({ title: '删除单元格', id: '47', icon: 'layui-icon-table-delete' });
            if (opt.tableDeleteRow) tableData.child.push({ title: '删除行', id: '48', icon: 'layui-icon-table-delete' });
            if (opt.tableDeleteCol) tableData.child.push({ title: '删除列', id: '49', icon: 'layui-icon-table-delete' });
            if (opt.tableDelete) tableData.child.push({ title: '删除表格', id: '410', icon: 'layui-icon-table-delete' });
            tableData.child.push({ type: '-' })
            tableData.child.push({ title: '边框和底纹', id: '411', icon: 'layui-icon-table-border' })
            tableData.child.push({ title: '表格属性', id: '412', icon: 'layui-icon-attribute' })
        } else if (opt.type == "1") {
            if (opt.seg == "1") {
                menuData.push({ title: '编辑页眉', id: '8', icon: 'layui-icon-header' })
            } else if (opt.seg == "2") {
                menuData.push({ title: '退出编辑页眉页脚', id: '10' })
            } else if (opt.seg == "3") {
                menuData.push({ title: '编辑页脚', id: '9', icon: 'layui-icon-footer' })
            }
        }
        layui.contextmenu.render({
            elem: '#editor-canvas',
            id: 'editor-canvas',
            data: menuData,
            clickEvent: (data) => {
                if (data.id == 1) {
                    EditorDocs.copyText()
                } else if (data.id == 2) {
                    EditorDocs.pasteText()
                } else if (data.id == 3) {
                    this.openParagraphForm()
                } else if (data.id == 5) {
                    this.openSymbolForm()
                } else if (data.id == 41) {
                    EditorDocs.tableInsertRowAbove()
                } else if (data.id == 42) {
                    EditorDocs.tableInsertRowBelow()
                } else if (data.id == 43) {
                    EditorDocs.tableInsertColLeft()
                } else if (data.id == 44) {
                    EditorDocs.tableInsertColRight()
                } else if (data.id == 45) {
                    EditorDocs.tableMerge()
                } else if (data.id == 46) {
                    EditorDocs.tableSplitInfo()
                } else if (data.id == 47) {
                    EditorDocs.tableDeleteInfo()
                } else if (data.id == 48) {
                    EditorDocs.tableDeleteRow()
                } else if (data.id == 49) {
                    EditorDocs.tableDeleteCol()
                } else if (data.id == 410) {
                    EditorDocs.tableDelete()
                } else if (data.id == 8) {
                    EditorDocs.editorHeader()
                } else if (data.id == 9) {
                    EditorDocs.editorFooter()
                } else if (data.id == 10) {
                    EditorDocs.editorBody()
                } else {
                    EditorDocs.refresh()
                }
            }
        })
        layui.dropdown.open('editor-canvas');
    },
    showMessage: function (msg) {
        layer.alert(msg, {
            skin: 'layui-layer-win10', // 2.8+
            shade: 0.01,
            btn: ['确定']
        })
    },
    showMask: function (visible) { },
    createFileMenu: function () {
        const $ = layui.$
        layui.linkButton.render({
            elem: '#doc-import',
            clickEvent: function () {
                $("#input-file").click();
            }
        });
        layui.linkButton.render({
            elem: '#doc-save',
            clickEvent: function () {
                const filedata = EditorDocs.fileExport()
                console.info(filedata)
                layer.msg("编辑器集成到业务系统后调用")
            }
        });
        layui.linkButton.render({
            elem: '#doc-download',
            clickEvent: function () {
                EditorDocs.fileDownload()
            }
        });
        layui.linkButton.render({
            elem: '#doc-preview',
            clickEvent: function () {
                EditorDocs.filePreview()
            }
        });
        layui.linkButton.render({
            elem: '#doc-print',
            clickEvent: function () {
                EditorDocs.filePrint()
            }
        });
        layui.linkButton.render({
            elem: '#doc-exp-image',
            clickEvent: function () {
                EditorDocs.fileExpImage()
            }
        });
        layui.linkButton.render({
            elem: '#doc-exp-pdf',
            clickEvent: function () {

            }
        });
    },
    createEditMenu: function () {
        layui.linkButton.render({
            elem: '#doc-paste',
            clickEvent: function () {
                EditorDocs.pasteText()
            }
        });
        layui.linkButton.render({
            elem: '#doc-copy',
            clickEvent: function () {
                EditorDocs.copyText()
            }
        });
        layui.linkButton.render({
            elem: '#doc-cut',
            clickEvent: function () {
                EditorDocs.cutText()
            }
        });
        layui.linkButton.render({
            elem: '#doc-undo',
            clickEvent: function () {
                EditorDocs.prevStack()
            }
        });
        layui.linkButton.render({
            elem: '#doc-undo',
            clickEvent: function () {
                EditorDocs.prevStack()
            }
        });
        layui.linkButton.render({
            elem: '#doc-redo',
            clickEvent: function () {
                EditorDocs.nextStack()
            }
        });

        layui.linkButton.render({
            elem: '#editor-outdent',
            clickEvent: function () {
                const style = EditorDocs.getParagStyle()
                EditorDocs.changeParagStyle({ indentLeft: Math.max(0, style.indentLeft - 0.5) })
            }
        });
        layui.linkButton.render({
            elem: '#editor-indent',
            clickEvent: function () {
                const style = EditorDocs.getParagStyle()
                EditorDocs.changeParagStyle({ indentLeft: style.indentLeft + 0.5 })
            }
        });
    },
    createFontMenu: function () {
        const $ = layui.$
        layui.each(EditorDocs.getFontFamilyList(), function (i, e) {
            $("#font-family").append(layui.laytpl('<option value="{{= d.value }}">{{= d.name }}</option>').render(e));
        })
        layui.each(EditorDocs.getFontSizeList(), function (i, e) {
            $("#font-size").append(layui.laytpl('<option value="{{= d.value }}">{{= d.name }}</option>').render(e));
        })

        layui.form.on('select(font-family-filter)', function (data) {
            EditorDocs.changeTextStyle({ font: data.value })
            EditorDocs.refresh()
        });
        layui.form.on('select(font-size-filter)', function (data) {
            EditorDocs.changeTextStyle({ size: data.value })
            EditorDocs.refresh()
        });
        layui.linkButton.render({
            elem: '#font-increase',
            clickEvent: function () {
                const list = EditorDocs.getFontSizeList()
                const fontsize = EditorDocs.getTextStyle().size
                const index = list.findIndex(item => item.value <= fontsize)
                if (index > 0) {
                    const newsize = list[index - 1].value
                    layui.form.val('font-size-form-filter', { size: newsize })
                    EditorDocs.changeTextStyle({ size: newsize })
                }
                EditorDocs.refresh()
            }
        });
        layui.linkButton.render({
            elem: '#font-decrease',
            clickEvent: function () {
                const list = EditorDocs.getFontSizeList()
                const fontsize = EditorDocs.getTextStyle().size
                const index = list.findIndex(item => item.value <= fontsize)
                if (index >= 0 && index < list.length - 1) {
                    const newsize = list[index + 1].value
                    layui.form.val('font-size-form-filter', { size: newsize })
                    EditorDocs.changeTextStyle({ size: newsize })
                }
                EditorDocs.refresh()
            }
        });

        layui.fontColor.render({
            elem: "#font-color",
            id: 'font-color',
            clickEvent: function (color) {
                layui.fontColor.addUsedColor(color)
                EditorDocs.changeFontColor(color)
                EditorDocs.refresh()
            },
            paletteEvent: function () {
                WebUIControl.openColorDialog()
            }
        })
        layui.checkButton.render("#font-bold", function (val) {
            EditorDocs.changeTextStyle({ bold: val })
            EditorDocs.refresh()
        })
        layui.checkButton.render("#font-italic", function (val) {
            EditorDocs.changeTextStyle({ italic: val })
            EditorDocs.refresh()
        })
        layui.checkButton.render("#font-underline", function (val) {
            EditorDocs.changeTextStyle({ underline: val })
            EditorDocs.refresh()
        })
        layui.checkButton.render("#font-strikethrough", function (val) {
            EditorDocs.changeTextStyle({ strikethrough: val })
            EditorDocs.refresh()
        })
        layui.repelButton.render("script", function (val) {
            EditorDocs.changeTextStyle({ script: val })
            EditorDocs.refresh()
        })
        layui.radioButton.render("align", function (val) {
            EditorDocs.changeParagStyle({ align: val })
            EditorDocs.refresh()
        })
        layui.menuButton.render({
            elem: "#editor-line-spac",
            id: 'rowspac',
            data: [
                { id: '1', title: '1.0', value: 1.0 },
                { id: '2', title: '1.15', value: 1.15 },
                { id: '3', title: '1.5', value: 1.5 },
                { id: '4', title: '2', value: 2 },
                { id: '5', title: '2.5', value: 2.5 },
                { id: '6', title: '3', value: 3 },
            ],
            clickEvent: function (data) {
                EditorDocs.changeParagStyle({ rowspac: data.value })
                EditorDocs.refresh()
                layui.menuButton.selected('rowspac', data.value)
            }
        })
    },
    createInsertMenu: function () {
        const $ = layui.$
        layui.tableLayout.render({
            elem: '#insert-table',
            clickEvent: function (table) {
                EditorDocs.insertTable(table)
            }
        })

        layui.linkButton.render({
            elem: "#insert-image",
            clickEvent: function () {
                $("#input-image").click();
            }
        });


        layui.menuButton.render({
            elem: "#insert-shape",
            data: [
                { title: '直线', icon: 'layui-icon-shape-line', value: "line", },
                { title: '椭圆', icon: 'layui-icon-shape-ellipse', value: "ellipse", },
                { title: '矩形', icon: 'layui-icon-shape-rect', value: "rect", },
                { title: '三角形', icon: 'layui-icon-shape-triangle', value: "triangle", },
            ],
            clickEvent: function (data) {
                EditorDocs.insertShape(data.value)
            },
        })
        layui.menuButton.render({
            elem: "#insert-graphic-code",
            data: [
                { title: '条码', icon: 'layui-icon-barcode', value: 'barcode', },
                { title: '二维码', icon: 'layui-icon-qrcode', value: 'qrcode', },
            ],
            clickEvent: function (data) {
                if (data.value == 'barcode') {
                    layer.prompt({ title: '请输入条码内容' }, function (value, index, elem) {
                        if (value === '') return elem.focus();
                        layer.close(index);
                        EditorDocs.insertBarcode(value)
                    });
                } else if (data.value == 'qrcode') {
                    layer.prompt({ title: '请输入二维码内容', formType: 2 }, function (value, index, elem) {
                        if (value === '') return elem.focus();
                        layer.close(index);
                        EditorDocs.insertQrcode(value)
                    });
                }
            },
        })
        layui.menuButton.render({
            elem: "#insert-medicine",
            data: [
                { title: '月经史', icon: 'layui-icon-menstrual', value: 'menstrual', },
                { title: '牙位图', icon: 'layui-icon-tooth', value: 'tooth', },
                { title: '胎心位置', icon: 'layui-icon-fetalheart', value: 'fetalheart', },
            ],
            clickEvent: (data) => {
                if (data.value == 'menstrual') {
                    this.openMenstrualHistoryDialog();
                } else if (data.value == 'tooth') {
                    this.openToothDiagramDialog();
                } else if (data.value == 'fetalheart') {
                    this.openFetalPositionDialog()
                }
            },
        })
        layui.imageMenu.render({
            elem: "#insert-divider",
            id: 'insert-divider',
            data: [
                { id: '11', src: './core/image/divider-11.png', },
                { id: '12', src: './core/image/divider-12.png', },
                { id: '13', src: './core/image/divider-13.png', },
                { id: '14', src: './core/image/divider-14.png', },
                { id: '21', src: './core/image/divider-21.png', },
                { id: '22', src: './core/image/divider-22.png', },
            ],
            clickEvent: function (value) {
                EditorDocs.insertDivder(value)
            },
        })
        const date = new Date()
        layui.customtextmenu.render({
            elem: "#insert-calendar",
            id: 'insert-calendar',
            list: EditorDocs.getDataPatternList(),
            func: (value) => { return date.pattern(value) },
            clickEvent: function (value) {

            },
        })

        layui.cellmenu.render({
            elem: "#insert-symbol",
            id: 'insert-symbol',
            list: EditorDocs.getSymbolList(),
            clickEvent: (char) => {
                console.info(char)
                EditorDocs.insertWord(char)
            }
        })

        layui.viewMenu.render({
            elem: "#insert-signature",
            id: 'insert-signature',
            data: {
                viewButtons: [
                    [
                        { img: './core/image/signatrue-none.png', title: '暂无签名', value: '0', available: 'disabled' },
                    ],
                ],
                bottomButtons: [
                    { icon: 'layui-icon layui-icon-delete', title: '创建签名', value: 'create' },
                ]
            },
            buttonEvent: function (data) {
                if ("create" == data.value) {
                    WebUIControl.openSignatureDialog()
                }
            },
        })

        layui.menuButton.render({
            elem: "#insert-widget",
            data: [
                { title: '文本域', icon: 'layui-icon-text', value: '1', },
                { title: '下拉框', icon: 'layui-icon-combobox', value: '2', },
                { title: '多选框', icon: 'layui-icon-checkbox', value: '3', },
                { title: '单选框', icon: 'layui-icon-radiobox', value: '4', },
            ],
            clickEvent: (data) => {
                if (data.value == '1') {
                    EditorDocs.insertTextFieldWidget()
                } else if (data.value == '2') {
                    EditorDocs.insertComboboxWidget()
                } else if (data.value == '3') {
                    EditorDocs.insertCheckboxWidget()
                } else if (data.value == '4') {
                    EditorDocs.insertRadioboxWidget()
                }
            },
        })
    },
    createPageMenu: function () {
        const data1 = []
        EditorDocs.getPaperMarginList().forEach((e, i) => {
            data1.push({
                title: e.name,
                desc: `上下:${e.topBottom / 100}mm 左右:${e.leftRight / 100}mm`,
                type: '0',
                value: i,
                margins: e
            })
        })
        data1.push({ title: '自定义纸张边距', icon: 'layuix-icon layuix-icon-set', type: '1' })

        layui.descMenuButton.render({
            elem: "#paper-margin-set",
            data: data1,
            id: 'paper-margin-set',
            clickEvent: function (data) {
                if (data.type == '0') {
                    EditorDocs.setPaperInfo({
                        left: data.margins.leftRight,
                        right: data.margins.leftRight,
                        top: data.margins.topBottom,
                        bottom: data.margins.topBottom,
                    })
                    WebUIControl.triggerPaperInfo()
                } else {
                    WebUIControl.openPaperDialog()
                }
            }
        });


        const data2 = []
        EditorDocs.getPaperTypeList().forEach((e, i) => {
            data2.push({
                title: e.name,
                desc: `${e.width / 100} mm × ${e.height / 100} mm`,
                type: '0',
                value: i,
                size: e
            })
        })
        data2.push({ title: '自定义纸张大小', icon: 'layuix-icon layuix-icon-set', type: '1' })
        layui.descMenuButton.render({
            elem: "#paper-size-set",
            data: data2,
            id: 'paper-size-set',
            clickEvent: function (data) {
                if (data.type == '0') {
                    EditorDocs.setPaperInfo({ type: data.size.value })
                    WebUIControl.triggerPaperInfo()
                } else {
                    WebUIControl.openPaperDialog()
                }
            }
        });

        layui.menuButton.render({
            elem: "#paper-orientation-set",
            id: 'paper-orientation-set',
            data: [
                { title: '纵向', icon: 'layui-icon-paper-portrait', value: 'portrait', },
                { title: '横向', icon: 'layui-icon-paper-landscape', value: 'landscape', },
            ],
            clickEvent: function (data) {
                EditorDocs.setPaperInfo({ direction: data.value })
                WebUIControl.triggerPaperInfo()
            }
        })

        layui.viewMenu.render({
            elem: "#page-num-set",
            id: 'page-num-set',
            data: {
                viewButtons: [
                    [
                        { title: '无页码', img: './core/image/pagenumber-none.png', value: '0', alt: '无页码' }
                    ],
                    [
                        { title: '左侧', img: './core/image/pagenumber-left.png', value: '1', alt: '页脚左侧' },
                        { title: '中间', img: './core/image/pagenumber-center.png', value: '2', alt: '页脚中间' },
                        { title: '右侧', img: './core/image/pagenumber-right.png', value: '3', alt: '页脚右侧' },
                    ]
                ],
                bottomButtons: [
                    { icon: 'layui-icon layui-icon-set', title: '自定义页码', value: 'custom' },
                ]
            },
            buttonEvent: function (data) {
                if (data.value == 'custom') {
                    WebUIControl.openPageNumberDialog()
                }
            },
            viewEvent: function (data) {
                EditorDocs.insertPageNumber(data.value)
            }
        })

        layui.viewMenu.render({
            elem: "#paper-watermark",
            id: "paper-watermark",
            data: {
                viewButtons: [
                    [
                        { img: './core/image/watermark-sample-1.png', title: '保密', value: '1' },
                        { img: './core/image/watermark-sample-2.png', title: '样本', value: '2' },
                        { img: './core/image/watermark-sample-3.png', title: '严禁复制', value: '3' },
                    ],
                    [
                        { img: './core/image/watermark-sample-4.png', title: '原稿', value: '4' },
                        { img: './core/image/watermark-sample-5.png', title: '绝密', value: '5' },
                        { img: './core/image/watermark-sample-6.png', title: '紧急', value: '6' },
                    ]
                ],
                topButtons: [
                    { icon: 'layuix-icon layuix-icon-set', title: '自定义水印', value: 'custom', },
                ],
                bottomButtons: [
                    { icon: 'layui-icon layui-icon-delete', title: '删除水印', value: 'delete', },
                ]
            },
            buttonEvent: function (data) {
                if (data.value == 'delete') {
                    EditorDocs.deleteWatermark()
                } else if (data.value == 'custom') {
                    WebUIControl.openWatermarkDialog()
                }
            },
            viewEvent: function (data) {
                EditorDocs.insertWatermark("reserve", data.value)
            }
        })
    },
    createHelpMenu: function () {
        layui.linkButton.render({
            elem: '#system-about',
            clickEvent: () => {
                this.openAboutDialog()
            }
        });
    },
    createStateBar: function () {
        const $ = layui.$
        const zoomScaleList = EditorDocs.getZoomScaleList()
        const setZoom = (value) => {
            $("#status-zoom-show").html(`${parseInt(value * 100)}%`)
            EditorDocs.setZoom(value);
        }
        layui.xslider.render({
            elem: '#status-zoom-slider',
            id: 'status-zoom-slider',
            list: zoomScaleList,
            inputEvent: function (value) {
                setZoom(value)
            }
        });
        layui.linkButton.render({
            elem: '#status-zoom-reduce',
            clickEvent: function () {
                const list = zoomScaleList
                const curRat = EditorDocs.getZoomRatio();
                const index = list.findIndex((i) => i >= curRat);
                if (index > 0) {
                    layui.xslider.setIndex('status-zoom-slider', index - 1);
                    setZoom(list[index - 1])
                }
            }
        });
        layui.linkButton.render({
            elem: '#status-zoom-magnify',
            clickEvent: function () {
                const list = zoomScaleList
                const curRat = EditorDocs.getZoomRatio();
                const index = list.findIndex((i) => i > curRat);
                if (index >= 0) {
                    layui.xslider.setIndex('status-zoom-slider', index);
                    setZoom(list[index])
                }
            }
        });

        layui.linkButton.render({
            elem: '#status-zoom-best',
            clickEvent: function () {
                const scrolwidth = $("#panel-scroll").width() - 40
                const viewwidth = EditorDocs.getViewSize().width;
                const ratio = Math.floor((scrolwidth / viewwidth) * 100) / 100
                setZoom(ratio)
                layui.xslider.setValue('status-zoom-slider', ratio);
            }
        })

        layui.checkButton.render("#status-zoom-full", function (val) {
            EditorDocs.devicesTool("fullscreen")
        })
    },
    triggerFileLoad: function () {
        const $ = layui.$
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
    triggerPaperInfo: function () {
        const paperInfo = EditorDocs.getPaperInfo()
        const marginIndex = EditorDocs.getPaperMarginList().findIndex(e => {
            return e.leftRight == paperInfo.left
                && e.leftRight == paperInfo.right
                && e.topBottom == paperInfo.top
                && e.topBottom == paperInfo.bottom
        })
        if (marginIndex >= 0) {
            layui.descMenuButton.selected("paper-margin-set", marginIndex)
        }


        const paperIndex = EditorDocs.getPaperTypeList().findIndex(e => {
            return e.value == paperInfo.type
        })
        if (paperIndex >= 0) {
            layui.descMenuButton.selected("paper-size-set", paperIndex)
        }

        layui.menuButton.selected("paper-orientation-set", paperInfo.direction)

    },
    openParagraphForm: function () {
        const $ = layui.$
        const style = EditorDocs.getParagStyle()
        $.get("./core/form/paragraphForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '段落',
                area: ['390px', '400px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderSelect("#form-p-align", EditorDocs.getParagAlignList(), style.align, {}, (val) => {
                        style.align = val
                    })
                    layui.tools.renderSelect("#form-indent-other", EditorDocs.getParagIndentList(), style.indentSpecialType, {}, (val) => {
                        style.indentSpecialType = val
                    })
                    layui.tools.renderSelect("#form-row-space", EditorDocs.getParagSpaceList(), style.rowspac, {}, (val) => {
                        console.info(val)
                        style.rowspac = val
                    })
                    const opt = { min: 0, max: 20, step: 0.5 }
                    layui.tools.renderNumber("#form-indent-value", style.indentSpecialvalue, opt, (val) => {
                        style.indentSpecialvalue = val
                    })
                    layui.tools.renderNumber("#form-indent-left", style.indentLeft, opt, (val) => {
                        style.indentLeft = val
                    })
                    layui.tools.renderNumber("#form-indent-right", style.indentRight, opt, (val) => {
                        style.indentRight = val
                    })
                    layui.tools.renderNumber("#form-space-pre", style.segmentSpacPre, opt, (val) => {
                        style.segmentSpacPre = val
                    })
                    layui.tools.renderNumber("#form-space-aft", style.segmentSpacAft, opt, (val) => {
                        style.segmentSpacAft = val
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.changeParagStyle(style)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openSymbolForm: function () {

    },
    openSignatureDialog: function () {
        const $ = layui.$
        $.get("./core/form/inputSignatureForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '创建签名',
                skin: 'layui-layer-win10', // 2.8+
                area: ['422px', '296px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    EditorDocs.registerSignature({ signatureid: "form-signature-cvs" })
                },
                yes: function (index, layero, that) {
                    const base64 = EditorDocs.getSignature()
                    EditorDocs.insertSignature(base64)
                    EditorDocs.cancelSignature()
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openPaperDialog: function () {
        const $ = layui.$
        const content = EditorDocs.getPaperInfo()
        $.get("./core/form/paperSetForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '页面设置',
                skin: 'layui-layer-win10', // 2.8+
                area: ['436px', '309px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    const setValues = (record) => {
                        console.info(record)
                        if (record.standard) {
                            layui.tools.setNumberValue("#form-page-width", record.width / 100)
                            layui.tools.setNumberValue("#form-page-height", record.height / 100)
                            layui.tools.setNumberDisabled("#form-page-width", true)
                            layui.tools.setNumberDisabled("#form-page-height", true)
                        } else {
                            layui.tools.setNumberDisabled("#form-page-width", false)
                            layui.tools.setNumberDisabled("#form-page-height", false)
                        }
                    }

                    layui.form.render()
                    const opt = { valueField: 'value', textField: 'name', }

                    const ptlist = EditorDocs.getPaperTypeList()
                    const record = ptlist.find(item => item.value == content.type)
                    if (record) setValues(record);
                    layui.tools.renderSelect("#form-page-type", ptlist, content.type, opt, (val, record) => {
                        content.type = val
                        setValues(record)
                    })
                    layui.tools.renderSelect("#form-page-direction", EditorDocs.getPaperDirecList(), content.direction, opt, (val) => {
                        content.direction = val
                        const width = $("#form-page-width").val()
                        const height = $("#form-page-height").val()
                        layui.tools.setNumberValue("#form-page-width", height)
                        layui.tools.setNumberValue("#form-page-height", width)
                    })
                    const opt1 = { min: 0, max: 9999999, step: 1, }
                    layui.tools.renderNumber("#form-page-width", content.widht / 100, opt1, (val) => {
                        content.widht = val * 100
                    })
                    layui.tools.renderNumber("#form-page-height", content.height / 100, opt1, (val) => {
                        content.height = val * 100
                    })
                    const opt2 = { min: 0, max: 50, step: 1, }
                    layui.tools.renderNumber("#form-page-padding-top", content.top / 100, opt2, (val) => {
                        content.top = val * 100
                    })
                    layui.tools.renderNumber("#form-page-padding-bottom", content.bottom / 100, opt2, (val) => {
                        content.bottom = val * 100
                    })
                    layui.tools.renderNumber("#form-page-padding-left", content.left / 100, opt2, (val) => {
                        content.left = val * 100
                    })
                    layui.tools.renderNumber("#form-page-padding-right", content.right / 100, opt2, (val) => {
                        content.right = val * 100
                    })

                },
                yes: function (index, layero, that) {
                    EditorDocs.setPaperInfo(content)
                    WebUIControl.triggerPaperInfo()
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openWatermarkDialog: function () {
        const $ = layui.$
        const opt = {
            text: "",
            style: "1",
            transparency: 30,
            fontfamily: "SimSun",
            fontsize: 2000,
        }
        $.get("./core/form/watermarkForm.html", function (data) {

            layui.layer.open({
                type: 1,
                title: '自定义水印',
                skin: 'layui-layer-win10', // 2.8+
                area: ['361px', '293px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    const canvas = document.getElementById("form-watermark-canvas")
                    const preview = () => {
                        EditorDocs.canvasTool(canvas, "drawWaterMark", opt)
                    }
                    layui.form.render()
                    // 渲染
                    layui.slider.render({
                        elem: '#form-watermark-transparency',
                        min: 0,
                        max: 100,
                        value: opt.transparency,
                        change: (val) => {
                            opt.transparency = val
                            preview()
                        }
                    });

                    layui.tools.renderText("#form-watermark-text", "", { placeholder: '水印文字' }, (val) => {
                        opt.text = val
                        if (opt.text && opt.text.length > 0) {
                            preview()
                        }
                    })
                    layui.tools.renderSelect("#form-watermark-family", EditorDocs.getFontFamilyList(), opt.fontfamily, { valueField: 'value', textField: 'name', }, (val, record) => {
                        opt.fontfamily = val
                        preview()
                    })
                    layui.tools.renderSelect("#form-watermark-size", EditorDocs.getWaterMarkFontSizeList(), opt.fontsize, { valueField: 'value', textField: 'name', }, (val, record) => {
                        opt.fontsize = val
                        preview()
                    })
                    layui.tools.renderRadio("input[name='form-watermark-style']", opt.style, {}, (val) => {
                        opt.style = val
                        preview()
                    })
                },
                yes: function (index, layero, that) {
                    if (EditorDocs.stringTool("isNotBlank", opt.text)) {
                        EditorDocs.insertWatermark('cutsom', opt)
                        layui.layer.close(index);
                    } else {
                        layer.msg('水印文本内容必须填写!', () => {
                            $("#form-watermark-text").focus()
                        });

                    }
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openColorDialog: function () {
        const $ = layui.$
        $.get("./core/form/colorPaletteForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '颜色选择',
                skin: 'layui-layer-win10', // 2.8+
                area: ['370px', '443px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    const options = {
                        platter: document.getElementById("color-platter"),
                        barhelper: document.getElementById("color-bar"),
                        show: document.getElementById("color-show"),
                    }
                    EditorDocs.createColorPanel(options)
                },
                yes: function (index, layero, that) {
                    const color = EditorDocs.getSeletedColor();
                    layui.fontColor.addUsedColor(color)
                    layui.fontColor.setColor("#font-color", color)
                    EditorDocs.changeFontColor(color)
                    EditorDocs.refresh()
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openMenstrualHistoryDialog: function () {
        const $ = layui.$
        $.get("./core/form/m13yForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '月经史表达式编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['536px', '256px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {

                },
                yes: function (index, layero, that) {
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openToothDiagramDialog: function () {
        const $ = layui.$
        $.get("./core/form/t10mForm.html", function (data) {
            layui.layer.open({
                type: 1,
                skin: 'layui-layer-win10', // 2.8+
                title: '牙位图表达式编辑',
                area: ['690px', '570px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {

                },
                yes: function (index, layero, that) {
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openFetalPositionDialog: function () {
        const $ = layui.$
        $.get("./core/form/f11nForm.html", function (data) {
            layui.layer.open({
                type: 1,
                skin: 'layui-layer-win10', // 2.8+
                title: '胎心位置表达式编辑',
                area: ['536px', '236px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {

                },
                yes: function (index, layero, that) {
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openPageNumberDialog: function () {
        const $ = layui.$
        $.get("./core/form/pageNumForm.html", function (data) {
            const info = EditorDocs.getPageNumInfo()
            layui.layer.open({
                type: 1,
                skin: 'layui-layer-win10', // 2.8+
                title: '自定义页面',
                area: ['330px', '220px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    
                    layui.tools.renderSelect("#form-pagenum-show", EditorDocs.getPageNumShowList(), info.number, {}, (val) => {
                        info.number = val
                    })
                    layui.tools.renderSelect("#form-pagenum-align", EditorDocs.getPageNumAlignList(), info.align, {}, (val) => {
                        info.align = val
                    })
                    const opt = { textField: 'name', valueField: 'value' }
                    layui.tools.renderSelect("#form-pagenum-format", EditorDocs.getPageNumPatternList(), info.format, opt, (val) => {
                        info.format = val
                    })
                    layui.tools.renderSelect("#form-pagenum-size", EditorDocs.getFontSizeList(), info.size, opt, (val) => {
                        info.size = val
                    })
                    layui.tools.renderSelect("#form-pagenum-family", EditorDocs.getFontFamilyList(), info.family, opt, (val) => {
                        info.family = val
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.changePageNum(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openAboutDialog: function () {
        const $ = layui.$
        $.get("./core/form/aboutForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '关于系统',
                skin: 'layui-layer-win10', // 2.8+
                area: ['436px', '336px'],
                btn: ['关闭'],
                content: data,
                success: function (layero, index, that) {

                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
}