function create(conf) {
    layui.use(function () {
        EditorDocs.create(WebUIControl, conf);
        EditorDocs.newDocument(conf);
    });
}
function load(conf, doc) {
    layui.use(function () {
        EditorDocs.create(WebUIControl, conf);
        EditorDocs.loadDocument(doc);
    });
}

function loadTemplet(conf, doc, data) {
    layui.use(function () {
        EditorDocs.create(WebUIControl, conf);
        EditorDocs.loadDocument(doc);
        EditorDocs.initDocument(data);
    });
}


WebUIControl = {
    domid: undefined,
    commentsid: undefined,
    scrollid: undefined,
    init: function () {
        this.domid = document.getElementById("panel-editor-domid")
        this.commentsid = document.getElementById("panel-editor-commentsid")
        this.scrollid = document.getElementById("panel-scroll")
        this.initUI()
        this.initEvent()
    },
    initUI: function () {
        const $ = layui.$
        const menuJson = { tabs: [] }
        const baseBtn = { id: '', title: '', icon: '', showText: true, isDownMenu: false, isFont20: false, isFont18: false, style: '', cls: '', radio: '', repel: '', value: '', default: '', }
        let selectIndex = 0
        const fileJosn = {
            title: '文件',
            selected: false,
            groups: [{ type: "group", btns: [] }]
        }
        fileJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-import', title: '导入', icon: 'layui-icon-import', }))
        if (EditorDocs.isPrintModal()) {
            fileJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-save', title: '保存', icon: 'layui-icon-save', }))
            fileJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-download', title: '下载', icon: 'layui-icon-download', }))
            fileJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-preview', title: '预览', icon: 'layui-icon-preview', }))
            fileJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-print', title: '打印', icon: 'layui-icon-printer', }))
            fileJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-exp-image', title: '导出为图片', icon: 'layui-icon-picture', }))
            fileJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-exp-pdf', title: '导出为PDF', icon: 'layui-icon-export-pdf', }))
        }
        menuJson.tabs.push(fileJosn)
        if (EditorDocs.isModifyModal()) {
            const editJosn = {
                title: '编辑',
                selected: false,
                groups: [
                    { type: "group", btns: [] },
                    { type: "select", id: "font-family", name: "family", width: '120px' },
                    { type: "select", id: "font-size", name: "size", width: '70px' },
                    { type: "group", btns: [] },
                    { type: "group", btns: [] },
                    { type: "group", btns: [] },
                    { type: "group", btns: [] },
                    { type: "group", btns: [] },
                ]
            }
            editJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-paste', title: '粘贴', icon: 'layui-icon-paste', showText: false, isFont20: true, }))
            editJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-copy', title: '复制', icon: 'layui-icon-copy', showText: false, isFont20: true, }))
            editJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-cut', title: '剪切', icon: 'layui-icon-cut', showText: false, isFont20: true, }))
            editJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-undo', title: '回退', icon: 'layui-icon-undo', showText: false, isFont20: true, }))
            editJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'doc-redo', title: '重做', icon: 'layui-icon-redo', showText: false, isFont20: true, }))
            editJosn.groups[3].btns.push(Object.assign({}, baseBtn, { id: 'font-increase', title: '字体增大', icon: 'layui-icon-font-increase', showText: false, isFont20: true, }))
            editJosn.groups[3].btns.push(Object.assign({}, baseBtn, { id: 'font-decrease', title: '字体减小', icon: 'layui-icon-font-decrease', showText: false, isFont20: true, }))
            editJosn.groups[3].btns.push(Object.assign({}, baseBtn, { id: 'font-color', title: '字体颜色', icon: 'layui-icon-font-color', showText: false, isFont20: true, isDownMenu: true }))
            editJosn.groups[4].btns.push(Object.assign({}, baseBtn, { id: 'font-bold', title: '加粗', icon: 'layui-icon-bold', showText: false, isFont20: true, }))
            editJosn.groups[4].btns.push(Object.assign({}, baseBtn, { id: 'font-italic', title: '斜体', icon: 'layui-icon-italic', showText: false, isFont20: true, }))
            editJosn.groups[4].btns.push(Object.assign({}, baseBtn, { id: 'font-underline', title: '下划线', icon: 'layui-icon-underline', showText: false, isFont20: true, }))
            editJosn.groups[4].btns.push(Object.assign({}, baseBtn, { id: 'font-strikethrough', title: '删除线', icon: 'layui-icon-strikethrough', showText: false, isFont20: true, }))
            editJosn.groups[4].btns.push(Object.assign({}, baseBtn, { title: '上标', icon: 'layui-icon-superscript', showText: false, isFont20: true, value: "sup", def: "nor", repel: "script" }))
            editJosn.groups[4].btns.push(Object.assign({}, baseBtn, { title: '下标', icon: 'layui-icon-subscript', showText: false, isFont20: true, value: "sub", def: "nor", repel: "script" }))
            editJosn.groups[5].btns.push(Object.assign({}, baseBtn, { title: '左对齐', icon: 'layui-icon-align-left', showText: false, isFont20: true, value: "left", radio: "align", cls: "editor-align" }))
            editJosn.groups[5].btns.push(Object.assign({}, baseBtn, { title: '居中对齐', icon: 'layui-icon-align-center', showText: false, isFont20: true, value: "center", radio: "align", cls: "editor-align" }))
            editJosn.groups[5].btns.push(Object.assign({}, baseBtn, { title: '右对齐', icon: 'layui-icon-align-right', showText: false, isFont20: true, value: "right", radio: "align", cls: "editor-align" }))
            editJosn.groups[5].btns.push(Object.assign({}, baseBtn, { title: '两端对齐', icon: 'layui-icon-align-both', showText: false, isFont20: true, value: "both", radio: "align", cls: "editor-align" }))
            editJosn.groups[5].btns.push(Object.assign({}, baseBtn, { title: '分散对齐', icon: 'layui-icon-align-dispersed', showText: false, isFont20: true, value: "dispersed", radio: "align", cls: "editor-align" }))
            editJosn.groups[6].btns.push(Object.assign({}, baseBtn, { id: 'editor-line-spac', title: '行距', icon: 'layui-icon-line-spacing', showText: false, isFont20: true, isDownMenu: true }))
            editJosn.groups[6].btns.push(Object.assign({}, baseBtn, { id: 'editor-line-outdent', title: '减少缩进量', icon: 'layui-icon-outdent', showText: false, isFont20: true }))
            editJosn.groups[6].btns.push(Object.assign({}, baseBtn, { id: 'editor-line-indent', title: '增加缩进量', icon: 'layui-icon-indent', showText: false, isFont20: true }))
            editJosn.groups[7].btns.push(Object.assign({}, baseBtn, { id: 'editor-find', title: '查找', icon: 'layui-icon-find', showText: false, isFont20: true }))
            editJosn.groups[7].btns.push(Object.assign({}, baseBtn, { id: 'editor-replace', title: '替换', icon: 'layui-icon-replace', showText: false, isFont20: true }))
            menuJson.tabs.push(editJosn)

            const insertJosn = {
                title: '插入',
                selected: false,
                groups: [
                    { type: "group", btns: [] },
                ]
            }
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-table', title: '表格', icon: 'layui-icon-table', isFont18: true, isDownMenu: true }))
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-image', title: '图片', icon: 'layui-icon-picture', isFont18: true, isDownMenu: true }))
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-shape', title: '形状', icon: 'layui-icon-shape', isFont18: true, isDownMenu: true }))
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-symbol', title: '特殊符号', icon: 'layui-icon-omega', isFont18: true, isDownMenu: true }))
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-medicine', title: '医学表达式', icon: 'layui-icon-medicine', isFont18: true, isDownMenu: true }))
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-divider', title: '分割线', icon: 'layui-icon-divider', isFont18: true, isDownMenu: true }))
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-graphic-code', title: '图形码', icon: 'layui-icon-code', isFont18: true, isDownMenu: true }))
            if (EditorDocs.isDesignModal()) {
                insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-calendar', title: '日期', icon: 'layui-icon-calendar', isFont18: true, isDownMenu: true }))
                insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-widget', title: '控件', icon: 'layui-icon-form', isFont18: true, isDownMenu: true }))
            }
            insertJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'insert-signature', title: '签名', icon: 'layui-icon-signature1', isFont18: true, isDownMenu: true }))
            menuJson.tabs.push(insertJosn)
            selectIndex = 1
        }

        if (EditorDocs.isDesignModal()) {
            const paperJosn = {
                title: '页面',
                selected: false,
                groups: [
                    { type: "group", btns: [] },
                ]
            }
            paperJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'paper-margin-set', title: '页边距', icon: 'layui-icon-paper-margin', isFont18: true, isDownMenu: true }))
            paperJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'paper-size-set', title: '纸张大小', icon: 'layui-icon-paper-size', isFont18: true, isDownMenu: true }))
            paperJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'paper-orientation-set', title: '纸张方向', icon: 'layui-icon-paper-orientation', isFont18: true, isDownMenu: true }))
            paperJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'page-num-set', title: '页码', icon: 'layui-icon-page-num', isFont18: true, isDownMenu: true }))
            paperJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'paper-watermark', title: '水印', icon: 'layui-icon-watermark', isFont18: true, isDownMenu: true }))

            menuJson.tabs.push(paperJosn)
        }


        if (EditorDocs.isModifyModal() || EditorDocs.isReviewModal()) {
            const reviewJosn = {
                title: '审阅',
                selected: false,
                groups: [
                    { type: "group", btns: [] },
                    { type: "group", btns: [] },
                ]
            }
            if (EditorDocs.isModifyModal()) {
                reviewJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'review-show-comments', title: '批注视图', icon: 'layui-icon-comments', isFont18: true, isDownMenu: true }))
            }
            reviewJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'review-insert-comments', title: '新建批注', icon: 'layui-icon-comments', isFont18: true }))
            //reviewJosn.groups[1].btns.push(Object.assign({}, baseBtn, { id: 'review-commit', title: '提交版本', icon: 'layui-icon-commit', isFont18: true, }))
            //reviewJosn.groups[1].btns.push(Object.assign({}, baseBtn, { id: 'review-history', title: '历史版本', icon: 'layui-icon-history', isFont18: true, }))
            menuJson.tabs.push(reviewJosn)
            selectIndex = 1
        }

        const helpJosn = {
            title: '帮助',
            selected: false,
            groups: [
                { type: "group", btns: [] },
            ]
        }
        helpJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'system-printer', title: '下载打印控件', icon: 'layui-icon-printer', }))
        helpJosn.groups[0].btns.push(Object.assign({}, baseBtn, { id: 'system-about', title: '关于', icon: 'layui-icon-about', }))
        menuJson.tabs.push(helpJosn)
        menuJson.tabs[selectIndex].selected = true
        $(".editor-north").html(layui.menuBar.render(menuJson))
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
        this.createCommentsMenu()
        this.createHelpMenu()
        this.createStateBar()
        this.triggerFileLoad()
    },
    synchroData: function () { },
    synchroPageInfo: function (pagecur, pagecou, charcou) {
        const $ = layui.$
        const info = EditorDocs.getConfigInfo()
        $("#status-page-info").html(`${pagecur}/${pagecou}`)
        $("#status-char-info").html(`字数:${charcou}`)
        $("#status-model-info").html(info.modalName)
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
    showPopMenu: function (opt) {
        if (opt.property.cls == "1") {
            layui.datepick.render({
                elem: '#editor-canvas',
                id: '#editor-canvas-1',
                clickEvent: (value) => {
                    EditorDocs.changeDatePickerValue(opt.id, value.getTime())
                    layui.dropdown.close('#editor-canvas');
                }
            })
            layui.dropdown.open('#editor-canvas-1');
        } else if (opt.property.cls == "3") {
            const info = EditorDocs.getCompInfo(opt.id)
            layui.popTable.renderText({
                elem: '#editor-canvas',
                id: '#editor-canvas-3',
                data: info.property.value,
                saveEvent: (value) => {
                    EditorDocs.changeTextFieldValue(opt.id, value)
                    layui.dropdown.close('#editor-canvas-3');
                },
                cancelEvent: () => {
                    layui.dropdown.close('#editor-canvas-3');
                },
            })
            layui.dropdown.open('#editor-canvas-3');
        } else if (opt.property.cls == "6") {
            const info = EditorDocs.getCompInfo(opt.id)
            layui.popTable.renderSingle({
                elem: '#editor-canvas',
                id: '#editor-canvas-6',
                data: info.property.options,
                source: info.property.datasource,
                filter: info.property.filter,
                selectEvent: (value) => {
                    EditorDocs.changeSingleFieldValue(opt.id, value)
                    layui.dropdown.close('#editor-canvas-6');
                }
            })
            layui.dropdown.open('#editor-canvas-6');
        } else if (opt.property.cls == "7") {
            const info = EditorDocs.getCompInfo(opt.id)
            layui.popTable.renderMultiple({
                elem: '#editor-canvas',
                id: '#editor-canvas-7',
                data: info.property.options,
                source: info.property.datasource,
                filter: info.property.filter,
                saveEvent: (value) => {
                    EditorDocs.changeMultipleFieldValue(opt.id, value)
                    layui.dropdown.close('#editor-canvas-7');
                },
                cancelEvent: () => {
                    layui.dropdown.close('#editor-canvas-7');
                },
            })
            layui.dropdown.open('#editor-canvas-7');
        }
    },
    showContextMenu: function (opt) {
        const menuData = []
        if (opt.type == "0") {
            menuData.push({ title: '复制', id: '01', icon: 'layui-icon-copy', disabled: !opt.copy })
            menuData.push({ title: '粘贴', id: '02', icon: 'layui-icon-paste' })
            menuData.push({ type: '-' })
            const tableData = { title: '表格', type: 'parent', icon: 'layui-icon-table', child: [] }
            if (opt.table) menuData.push(tableData);
            if (opt.compClass == "1") {
                menuData.push({ title: '日期组件', id: '1101', icon: 'layui-icon-calendar' })
            } else if (opt.compClass == "2") {
                menuData.push({ title: '文本框', id: '1102', icon: 'layui-icon-text' })
            } else if (opt.compClass == "3") {
                menuData.push({ title: '数据文本域', id: '1103', icon: 'layui-icon-text' })
            } else if (opt.compClass == "4") {
                menuData.push({ title: '多选框', id: '1104', icon: 'layui-icon-checkbox' })
            } else if (opt.compClass == "5") {
                menuData.push({ title: '单选框', id: '1105', icon: 'layui-icon-radiobox' })
            } else if (opt.compClass == "6") {
                menuData.push({ title: '单选选择域', id: '1106', icon: 'layui-icon-combobox' })
            } else if (opt.compClass == "7") {
                menuData.push({ title: '多选选择域', id: '1107', icon: 'layui-icon-combobox' })
            }
            if (opt.paragraph) menuData.push({ title: '段落', id: '03', icon: 'layui-icon-paragraph' })
            if (opt.symbols) menuData.push({ title: '插入符号', id: '05', icon: 'layui-icon-omega' })
            if (opt.comments) menuData.push({ title: '插入批注', id: '13', icon: 'layui-icon-comments' })
            if (opt.image) {
                menuData.push({ title: '更换图片', id: '06', icon: 'layui-icon-picture' })
            }
            if (opt.gahcode) {
                menuData.push({ title: '修改条码', id: '07', icon: 'layui-icon-code' })
            }
            if (opt.expExtent) {
                if (opt.expExtent.type == 0) {
                    menuData.push({ title: '月经史', id: '1201', icon: 'layui-icon-menstrual' })
                } else if (opt.expExtent.type == 1) {
                    menuData.push({ title: '牙位图', id: '1202', icon: 'layui-icon-tooth' })
                } else if (opt.expExtent.type == 2) {
                    menuData.push({ title: '胎心位置', id: '1203', icon: 'layui-icon-fetalheart' })
                }
            }

            tableData.child.push({ title: '在上方插入行', id: '0401', icon: 'layui-icon-table-above' })
            tableData.child.push({ title: '在下方插入行', id: '0402', icon: 'layui-icon-table-below' })
            tableData.child.push({ type: '-' })
            tableData.child.push({ title: '在左侧插入列', id: '0403', icon: 'layui-icon-table-left' })
            tableData.child.push({ title: '在右侧插入列', id: '0404', icon: 'layui-icon-table-right' })
            tableData.child.push({ type: '-' })
            if (opt.tableMerge) tableData.child.push({ title: '合并单元格', id: '0405', icon: 'layui-icon-table-merge' });
            if (opt.tableSplit) tableData.child.push({ title: '拆分单元格', id: '0406', icon: 'layui-icon-table-split' });
            if (opt.tableDeleteCell) tableData.child.push({ title: '删除单元格', id: '0407', icon: 'layui-icon-table-delete' });
            if (opt.tableDeleteRow) tableData.child.push({ title: '删除行', id: '0408', icon: 'layui-icon-table-delete' });
            if (opt.tableDeleteCol) tableData.child.push({ title: '删除列', id: '0409', icon: 'layui-icon-table-delete' });
            if (opt.tableDelete) tableData.child.push({ title: '删除表格', id: '0410', icon: 'layui-icon-table-delete' });
            tableData.child.push({ type: '-' })
            tableData.child.push({ title: '边框和底纹', id: '0411', icon: 'layui-icon-table-border' })
            if (!opt.tableBorder) tableData.child.push({ title: '显示边框', id: '0412', icon: 'layui-icon-show' })
            if (opt.tableBorder) tableData.child.push({ title: '隐藏边框', id: '0413', icon: 'layui-icon-hide' })
            //tableData.child.push({ title: '表格属性', id: '0412', icon: 'layui-icon-attribute' })
        } else if (opt.type == "1") {
            if (opt.seg == "1") {
                menuData.push({ title: '编辑页眉', id: '08', icon: 'layui-icon-header' })
            } else if (opt.seg == "2") {
                menuData.push({ title: '退出编辑页眉页脚', id: '10' })
            } else if (opt.seg == "3") {
                menuData.push({ title: '编辑页脚', id: '09', icon: 'layui-icon-footer' })
            }
        }
        layui.contextmenu.render({
            elem: '#editor-canvas',
            id: 'editor-contextmenu',
            data: menuData,
            clickEvent: (data) => {
                if (data.id == '01') {
                    EditorDocs.copyText()
                } else if (data.id == '02') {
                    EditorDocs.pasteText()
                } else if (data.id == '03') {
                    this.openParagraphForm()
                } else if (data.id == '05') {
                    this.openSymbolForm()
                } else if (data.id == '0401') {
                    EditorDocs.tableInsertRowAbove()
                } else if (data.id == '0402') {
                    EditorDocs.tableInsertRowBelow()
                } else if (data.id == '0403') {
                    EditorDocs.tableInsertColLeft()
                } else if (data.id == '0404') {
                    EditorDocs.tableInsertColRight()
                } else if (data.id == '0405') {
                    EditorDocs.tableMerge()
                } else if (data.id == '0406') {
                    EditorDocs.tableSplitInfo()
                } else if (data.id == '0407') {
                    this.openTableDeleteOption(opt)
                } else if (data.id == '0408') {
                    EditorDocs.tableDeleteRow()
                } else if (data.id == '0409') {
                    EditorDocs.tableDeleteCol()
                } else if (data.id == '0410') {
                    EditorDocs.tableDelete()
                } else if (data.id == '0411') {
                    this.openTableBorderShading(opt)
                } else if (data.id == '0412') {
                    EditorDocs.tableBorderVisible(true)
                } else if (data.id == '0413') {
                    EditorDocs.tableBorderVisible(false)
                } else if (data.id == '08') {
                    EditorDocs.editorHeader()
                } else if (data.id == '09') {
                    EditorDocs.editorFooter()
                } else if (data.id == '10') {
                    EditorDocs.editorBody()
                } else if (data.id == '1101') {
                    this.openDatePickerCompForm(opt.compID)
                } else if (data.id == '1102') {
                    this.openTextBoxCompForm(opt.compID)
                } else if (data.id == '1103') {
                    this.openTextFieldCompForm(opt.compID)
                } else if (data.id == '1104') {
                    this.openCheckBoxCompForm(opt.compID)
                } else if (data.id == '1105') {
                    this.openRadioGroupCompForm(opt.compID)
                } else if (data.id == '1106') {
                    this.openSingleFieldCompForm(opt.compID)
                } else if (data.id == '1107') {
                    this.openMultipleFieldCompForm(opt.compID)
                } else if (data.id == '1201') {
                    this.openMenstrualHistoryForm(opt.expExtent, 'change')
                } else if (data.id == '1202') {
                    this.openToothDiagramDialog(opt.expExtent, 'change')
                } else if (data.id == '1203') {
                    this.openFetalPositionDialog(opt.expExtent, 'change')
                } else if (data.id == '13') {
                    this.openCommentsDialog()
                } else {
                    EditorDocs.refresh()
                }
            }
        })
        layui.dropdown.open('editor-contextmenu');
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
                EditorDocs.fileSave()
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
                    this.openMenstrualHistoryForm({}, 'insert');
                } else if (data.value == 'tooth') {
                    this.openToothDiagramDialog({}, 'insert');
                } else if (data.value == 'fetalheart') {
                    this.openFetalPositionDialog({}, 'insert')
                }
            },
        })
        layui.imageMenu.render({
            elem: "#insert-divider",
            id: 'insert-divider',
            data: [
                { id: '11', src: './image/divider-11.png', },
                { id: '12', src: './image/divider-12.png', },
                { id: '13', src: './image/divider-13.png', },
                { id: '14', src: './image/divider-14.png', },
                { id: '21', src: './image/divider-21.png', },
                { id: '22', src: './image/divider-22.png', },
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
            clickEvent: function (item) {
                EditorDocs.insertDatePicker(date.getTime(), item.value)
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
                        { img: './image/signatrue-none.png', title: '暂无签名', value: '0', available: 'disabled' },
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
                { title: '文本框', icon: 'layui-icon-text', value: '1', },
                { title: '多选框', icon: 'layui-icon-checkbox', value: '3', },
                { title: '单选框', icon: 'layui-icon-radiobox', value: '4', },
                { title: '数据文本域', icon: 'layui-icon-text', value: '7', },
                { title: '单选选项域', icon: 'layui-icon-combobox', value: '5', },
                { title: '多选选项域', icon: 'layui-icon-combobox', value: '6', },
            ],
            clickEvent: (data) => {
                if (data.value == '1') {
                    EditorDocs.insertTextBox()
                } else if (data.value == '3') {
                    EditorDocs.insertCheckbox()
                } else if (data.value == '4') {
                    EditorDocs.insertRadioGroup()
                } else if (data.value == '5') {
                    EditorDocs.insertSingleField()
                } else if (data.value == '6') {
                    EditorDocs.insertMultipleField()
                } else if (data.value == '7') {
                    EditorDocs.insertTextField()
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
                    EditorDocs.changePaperInfo({
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
                    EditorDocs.changePaperInfo({ type: data.size.value })
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
                EditorDocs.changePaperInfo({ direction: data.value })
                WebUIControl.triggerPaperInfo()
            }
        })

        layui.viewMenu.render({
            elem: "#page-num-set",
            id: 'page-num-set',
            data: {
                viewButtons: [
                    [
                        { title: '无页码', img: './image/pagenumber-none.png', value: '0', alt: '无页码' }
                    ],
                    [
                        { title: '左侧', img: './image/pagenumber-left.png', value: '1', alt: '页脚左侧' },
                        { title: '中间', img: './image/pagenumber-center.png', value: '2', alt: '页脚中间' },
                        { title: '右侧', img: './image/pagenumber-right.png', value: '3', alt: '页脚右侧' },
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
                        { img: './image/watermark-sample-1.png', title: '保密', value: '1' },
                        { img: './image/watermark-sample-2.png', title: '样本', value: '2' },
                        { img: './image/watermark-sample-3.png', title: '严禁复制', value: '3' },
                    ],
                    [
                        { img: './image/watermark-sample-4.png', title: '原稿', value: '4' },
                        { img: './image/watermark-sample-5.png', title: '绝密', value: '5' },
                        { img: './image/watermark-sample-6.png', title: '紧急', value: '6' },
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
    createCommentsMenu: function () {
        layui.menuButton.render({
            elem: "#review-show-comments",
            data: [
                { title: '显示未处理', icon: '', value: '2', },
                { title: '显示已处理', icon: '', value: '3', },
            ],
            clickEvent: (data) => {
                EditorDocs.changeCommentsView(data.value)
            },
        })
        layui.linkButton.render({
            elem: '#review-insert-comments',
            clickEvent: () => {
                this.openCommentsDialog()
            }
        });

    },
    createHelpMenu: function () {
        layui.linkButton.render({
            elem: '#system-printer',
            clickEvent: () => {
                const opt = { skin: 'layui-layer-win10', }
                layer.confirm('当前是否下载后台打印组件安装包?', opt, function (index) {
                    window.open("https://peach-down.netlify.app/peach-printer-setup.exe");
                    layui.layer.close(index);
                });
            }
        });
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
        layui.linkButton.render({
            elem: '#status-outline',
            clickEvent: () => {
                this.openOutlineDialog()
            }
        });
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
        $.get("./form/document/paragraphForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '段落',
                skin: 'layui-layer-win10', // 2.8+
                area: ['406px', '410px'],
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
    openTableDeleteOption: function () {
        const $ = layui.$
        $.get("./form/table/tableDeleteForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '表格删除选项',
                skin: 'layui-layer-win10', // 2.8+
                area: ['259px', '168px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    $('.input-radio[name="form-tabledel-opt"]:first').attr('checked', 'checked');
                },
                yes: function (index, layero, that) {
                    const info = $('.input-radio[name="form-tabledel-opt"]:checked').val()
                    EditorDocs.tableDeleteCell(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openTableBorderShading: function (opt) {
        const $ = layui.$
        const info = Object.assign({ range: "0" }, EditorDocs.tableCellInfo())
        $.get("./form/table/tableBorderForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '边框和底纹',
                skin: 'layui-layer-win10', // 2.8+
                area: ['292px', '218px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderSelect("#form-tableborder-range", EditorDocs.getTableBorderRangeList(), info.range, {}, (val) => {
                        info.range = val
                    })
                    layui.tools.renderCheck("#form-tableborder-top", info.border[0].visible, (val) => {
                        info.border[0].visible = val
                    })
                    layui.tools.renderCheck("#form-tableborder-right", info.border[1].visible, (val) => {
                        info.border[1].visible = val
                    })
                    layui.tools.renderCheck("#form-tableborder-bottom", info.border[2].visible, (val) => {
                        info.border[2].visible = val
                    })
                    layui.tools.renderCheck("#form-tableborder-left", info.border[3].visible, (val) => {
                        info.border[3].visible = val
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.tableBorderChange(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openSignatureDialog: function () {
        const $ = layui.$
        $.get("./form/document/signatureForm.html", function (data) {
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
        $.get("./form/document/paperSetForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '页面设置',
                skin: 'layui-layer-win10', // 2.8+
                area: ['490px', '309px'],
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
                    EditorDocs.changePaperInfo(content)
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
        $.get("./form/document/watermarkForm.html", function (data) {
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
    openOutlineDialog: function () {
        const $ = layui.$
        $.get("./form/document/outlineForm.html", function (data) {
            layui.layer.open({
                type: 1,
                title: '文档结构',
                skin: 'layui-layer-win10', // 2.8+
                area: ['610px', '350px'],
                btn: ['导出', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    const list = EditorDocs.getOutline()
                    layui.dataTable.renderComponent({
                        elem: '#form-outline-table',
                        data: list,
                        height: 235,
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.fileOutlineDownload()
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openCommentsDialog: function () {
        layui.layer.prompt(
            { title: '请填写批注信息', formType: 2, skin: 'layui-layer-win10 layui-layer-prompt', },
            function (value, index, elem) {
                if (value === '') return elem.focus();
                // layer.msg('获得：' + util.escape(value)); // 显示 value
                // // 关闭 prompt
                EditorDocs.insertComments(value);
                layer.close(index);
            });
    },
    openColorDialog: function () {
        const $ = layui.$
        $.get("./form/system/colorPaletteForm.html", function (data) {
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
    openMenstrualHistoryForm: function (opt, opc) {
        const $ = layui.$
        const options = [
            { label: '未闭经', value: '0' },
            { label: '已闭经', value: '1' },
        ]
        $.get("./form/expression/m13yForm.html", function (data) {
            const info = Object.assign(EditorDocs.getExpExtent(0), opt)
            layui.layer.open({
                type: 1,
                title: '月经史表达式编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['460px', '217px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    const menstSelectEnable = (val) => {
                        if (val == '0') {
                            $("#form-menst-7").hide();
                            $("#form-menst-8").show();
                        } else {
                            $("#form-menst-7").show();
                            $("#form-menst-8").hide();
                        }
                    }
                    menstSelectEnable(info.field1)
                    layui.tools.renderSelect("#form-menst-1", options, info.field1, {}, (val) => {
                        menstSelectEnable(val)
                        info.field1 = val
                    })
                    const numopt1 = { min: 0, max: 150, step: 1 }
                    const numopt2 = { min: 0, max: 300, step: 1 }
                    layui.tools.renderNumber("#form-menst-2", info.field2, numopt1, (val) => {
                        info.field2 = val
                    })
                    layui.tools.renderNumber("#form-menst-3", info.field2, numopt1, (val) => {
                        info.field3 = val
                    })
                    layui.tools.renderNumber("#form-menst-4", info.field4, numopt1, (val) => {
                        info.field4 = val
                    })
                    layui.tools.renderNumber("#form-menst-5", info.field5, numopt2, (val) => {
                        info.field5 = val
                    })
                    layui.tools.renderNumber("#form-menst-6", info.field6, numopt2, (val) => {
                        info.field6 = val
                    })
                    layui.tools.renderNumber("#form-menst-7", info.field7, numopt1, (val) => {
                        info.field7 = val
                    })
                    layui.tools.renderDate("#form-menst-8", info.field8, (val) => {
                        info.field8 = val
                    })
                },
                yes: function (index, layero, that) {
                    if (opc == 'insert') {
                        EditorDocs.insertExpression(info)
                    } else {
                        EditorDocs.changeExpressionValue(info)
                    }
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openToothDiagramDialog: function (opt, opc) {
        const $ = layui.$
        const info = Object.assign(EditorDocs.getExpExtent(1), layui.toothDiagram.create(), opt);
        $.get("./form/expression/t10mForm.html", function (data) {
            layui.layer.open({
                type: 1,
                skin: 'layui-layer-win10', // 2.8+
                title: '牙位图表达式编辑',
                area: ['690px', '530px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    let current = undefined
                    const selectedCls = "selected"
                    const remopro = () => {
                        $(".surface").removeClass(selectedCls);
                        $(".numerary").removeClass(selectedCls);
                    }
                    const showpro = (tinfo) => {
                        $(".surface").removeClass(selectedCls);
                        $(".numerary").removeClass(selectedCls);
                        tinfo.surface.forEach(sf => {
                            $(`.surface[data-type='${sf}']`).addClass(selectedCls)
                        })
                        $(`.numerary[data-type='${tinfo.numerary}']`).addClass(selectedCls)
                    }
                    const creattext = (arr) => {
                        let text = "&nbsp;"
                        arr.forEach(t => {
                            if (t.show) {
                                let temp = ""
                                if (t.numerary == 'r') {
                                    temp = `(${t.name}<sup>S</sup>)`
                                } else if (t.numerary == 'l') {
                                    temp = `(<sup>S</sup>${t.name})`
                                } else {
                                    temp = `${t.name}`
                                }
                                if (t.surface.length > 0) {
                                    temp += `<sup>${t.surface.join(",")}</sup>`
                                }
                                text += temp
                            }
                        })
                        return text
                    }
                    const prev = (tinfo) => {
                        $("#form-t10m-pre1").html(creattext(tinfo.top.left))
                        $("#form-t10m-pre2").html(creattext(tinfo.top.right))
                        $("#form-t10m-pre3").html(creattext(tinfo.bot.left))
                        $("#form-t10m-pre4").html(creattext(tinfo.bot.right))
                    }
                    const selt = (tinfo) => {
                        $(".tooth").removeClass(selectedCls);
                        $(".surface").removeClass(selectedCls);
                        $(".numerary").removeClass(selectedCls);
                        tinfo.top.left.forEach(t => {
                            if (t.show)
                                $(`.left>.up[data-tname="${t.name}"]`).addClass(selectedCls);
                        })
                        tinfo.top.right.forEach(t => {
                            if (t.show)
                                $(`.right>.up[data-tname="${t.name}"]`).addClass(selectedCls);
                        })
                        tinfo.bot.left.forEach(t => {
                            if (t.show)
                                $(`.left>.down[data-tname="${t.name}"]`).addClass(selectedCls);
                        })
                        tinfo.bot.right.forEach(t => {
                            if (t.show)
                                $(`.right>.down[data-tname="${t.name}"]`).addClass(selectedCls);
                        })

                    }
                    $(".t10m-btn").click(function () {
                        layui.toothDiagram.selects(info, $(this).data("event"))
                        current = undefined
                        prev(info)
                        selt(info)
                    })
                    $(".tooth").click(function () {
                        layui.toothDiagram.toggle(info, $(this).data("tname"), $(this).data("area"))
                        const tooth = layui.toothDiagram.getTooth(info, $(this).data("tname"), $(this).data("area"))
                        if (tooth.show) {
                            current = this
                        } else {
                            current = undefined
                        }
                        prev(info)
                        selt(info)
                        showpro(tooth)
                    })
                    $(".surface").click(function () {
                        if (current) {
                            layui.toothDiagram.updateSurface(info, $(current).data("tname"), $(current).data("area"), $(this).data("type"))
                            const tooth = layui.toothDiagram.getTooth(info, $(current).data("tname"), $(current).data("area"))
                            prev(info)
                            showpro(tooth)
                        }
                    })
                    $(".numerary").click(function () {
                        if (current) {
                            layui.toothDiagram.updateNumerary(info, $(current).data("tname"), $(current).data("area"), $(this).data("type"))
                            const tooth = layui.toothDiagram.getTooth(info, $(current).data("tname"), $(current).data("area"))
                            prev(info)
                            showpro(tooth)
                        }
                    })
                    prev(info)
                    selt(info)
                },
                yes: function (index, layero, that) {
                    if (opc == 'insert') {
                        EditorDocs.insertExpression(info)
                    } else {
                        EditorDocs.changeExpressionValue(info)
                    }
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openFetalPositionDialog: function (opt, opc) {
        const $ = layui.$
        $.get("./form/expression/f11nForm.html", function (data) {
            const info = Object.assign(EditorDocs.getExpExtent(2), opt)
            layui.layer.open({
                type: 1,
                skin: 'layui-layer-win10', // 2.8+
                title: '胎心位置表达式编辑',
                area: ['262px', '206px'],
                btn: ['确定', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    "123456".split("").forEach(c => {
                        layui.tools.renderCheck(`#form-fetal-field${c}`, info[`field${c}`], (val) => {
                            info[`field${c}`] = val
                        })
                    })
                },
                yes: function (index, layero, that) {
                    if (opc == 'insert') {
                        EditorDocs.insertExpression(info)
                    } else {
                        EditorDocs.changeExpressionValue(info)
                    }
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
        $.get("./form/document/pageNumForm.html", function (data) {
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
    openDatePickerCompForm: function (compID) {
        const $ = layui.$
        const table = layui.table
        $.get("./form/component/datepickerComponent.html", function (data) {
            const info = EditorDocs.getCompInfo(compID)
            const id = '#form-datapicker-identifier'
            const formatlist = EditorDocs.getDataPatternList().map(label => {
                return {
                    label: label,
                    value: label,
                }
            })
            layui.layer.open({
                type: 1,
                title: '日期选择组件属性编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['350px', '360px'],
                btn: ['保存', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderText("#form-datapicker-code", info.property.code, { placeholder: '结构化数据编码' }, (val) => {
                        info.property.code = val
                    })
                    layui.tools.renderText("#form-datapicker-describe", info.property.describe, { placeholder: '描述说明' }, (val) => {
                        info.property.describe = val
                    })
                    layui.tools.renderSelect("#form-datapicker-format", formatlist, info.property.format, {}, (val) => {
                        info.property.format = val
                    })
                    layui.tools.renderCheck("#form-datapicker-detete", info.property.deletable, (val) => {
                        info.property.deletable = val
                    })
                    layui.tools.renderCheck("#form-datapicker-required", info.property.required, (val) => {
                        info.property.required = val
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.changeCompInfo(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openTextBoxCompForm: function (compID) {
        const $ = layui.$
        $.get("./form/component/textboxComponent.html", function (data) {
            const info = EditorDocs.getCompInfo(compID)
            const id = '#form-textbox-identifier'
            layui.layer.open({
                type: 1,
                title: '文本框组件属性编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['358px', '358px'],
                btn: ['保存', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderText("#form-textbox-code", info.property.code, { placeholder: '结构化数据编码' }, (val) => {
                        info.property.code = val
                    })
                    layui.tools.renderText("#form-textbox-describe", info.property.describe, { placeholder: '描述说明' }, (val) => {
                        info.property.describe = val
                    })
                    layui.tools.renderText("#form-textbox-label", info.property.label, { placeholder: '空值字符串' }, (val) => {
                        info.property.label = val
                    })
                    layui.tools.renderCheck("#form-textbox-detete", info.property.deletable, (val) => {
                        info.property.deletable = val
                    })
                    layui.tools.renderCheck("#form-textbox-editable", info.property.editable, (val) => {
                        info.property.editable = val
                    })
                    layui.tools.renderCheck("#form-textbox-required", info.property.required, (val) => {
                        info.property.required = val
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.changeCompInfo(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openTextFieldCompForm: function (compID) {
        const $ = layui.$
        $.get("./form/component/textFieldComponent.html", function (data) {
            const info = EditorDocs.getCompInfo(compID)
            const id = '#form-textfield-identifier'
            layui.layer.open({
                type: 1,
                title: '数据文本域组件属性编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['358px', '358px'],
                btn: ['保存', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderText("#form-textfield-code", info.property.code, { placeholder: '结构化数据编码' }, (val) => {
                        info.property.code = val
                    })
                    layui.tools.renderText("#form-textfield-describe", info.property.describe, { placeholder: '描述说明' }, (val) => {
                        info.property.describe = val
                    })
                    layui.tools.renderText("#form-textfield-label", info.property.placeholder, { placeholder: '空值字符串' }, (val) => {
                        info.property.placeholder = val
                    })
                    layui.tools.renderCheck("#form-textfield-detete", info.property.deletable, (val) => {
                        info.property.deletable = val
                    })
                    layui.tools.renderCheck("#form-textfield-editable", info.property.editable, (val) => {
                        info.property.editable = val
                    })
                    layui.tools.renderCheck("#form-textfield-required", info.property.required, (val) => {
                        info.property.required = val
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.changeCompInfo(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openCheckBoxCompForm: function (compID) {
        const $ = layui.$
        $.get("./form/component/checkboxComponent.html", function (data) {
            const id = '#form-checkbox-identifier'
            const info = EditorDocs.getCompInfo(compID)
            layui.layer.open({
                type: 1,
                title: '多选框组件属性编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['358px', '358px'],
                btn: ['保存', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderText("#form-checkbox-code", info.property.code, { placeholder: '结构化数据编码' }, (val) => {
                        info.property.code = val
                    })
                    layui.tools.renderText("#form-checkbox-describe", info.property.describe, { placeholder: '描述说明' }, (val) => {
                        info.property.describe = val
                    })
                    layui.tools.renderText("#form-checkbox-label", info.property.label, { placeholder: '多选框标签' }, (val) => {
                        info.property.label = val
                    })
                    layui.tools.renderCheck("#form-checkbox-detete", info.property.deletable, (val) => {
                        info.property.deletable = val
                    })
                    layui.tools.renderCheck("#form-checkbox-required", info.property.required, (val) => {
                        info.property.required = val
                    })
                },
                yes: function (index, layero, that) {
                    EditorDocs.changeCompInfo(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openRadioGroupCompForm: function (compID) {
        const $ = layui.$
        $.get("./form/component/radiogroupComponent.html", function (data) {
            const info = EditorDocs.getCompInfo(compID)
            const idfid = '#form-radiobox-identifier'
            const optid = '#form-radiobox-options'
            layui.layer.open({
                type: 1,
                title: '单选框组件属性编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['340px', '495px'],
                btn: ['保存', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderText("#form-radiobox-code", info.property.code, { placeholder: '结构化数据编码' }, (val) => {
                        info.property.code = val
                    })
                    layui.tools.renderText("#form-radiobox-describe", info.property.describe, { placeholder: '描述说明' }, (val) => {
                        info.property.describe = val
                    })
                    layui.dataTable.renderOptions({
                        elem: optid,
                        data: info.property.options,
                        addbtn: '#form-radiobox-addo',
                        delbtn: '#form-radiobox-deto',
                    })
                    layui.tools.renderCheck("#form-radiobox-detete", info.property.deletable, (val) => {
                        info.property.deletable = val
                    })
                    layui.tools.renderCheck("#form-radiobox-required", info.property.required, (val) => {
                        info.property.required = val
                    })
                },
                yes: function (index, layero, that) {
                    if (!layui.dataTable.verifyOptions(optid)) {
                        layui.layer.msg("选项列表数据字段不能为空")
                        return
                    }
                    info.property.options = layui.dataTable.getData(optid)
                    EditorDocs.changeCompInfo(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openSingleFieldCompForm: function (compID) {
        const $ = layui.$
        $.get("./form/component/singleFieldComponent.html", function (data) {
            const info = EditorDocs.getCompInfo(compID)
            const idfid = "#form-singlefield-identifier"
            const optid = '#form-singlefield-options'
            layui.layer.open({
                type: 1,
                title: '单选选择域组件属性编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['510px', '450px'],
                btn: ['保存', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderText("#form-singlefield-code", info.property.code, { placeholder: '结构化数据编码' }, (val) => {
                        info.property.code = val
                    })
                    layui.tools.renderText("#form-singlefield-describe", info.property.describe, { placeholder: '描述说明' }, (val) => {
                        info.property.describe = val
                    })
                    layui.dataTable.renderOptions({
                        elem: optid,
                        data: info.property.options,
                        addbtn: '#form-singlefield-addo',
                        delbtn: '#form-singlefield-deto',
                    })
                    layui.tools.renderCheck("#form-singlefield-detete", info.property.deletable, (val) => {
                        info.property.deletable = val
                    })
                    layui.tools.renderCheck("#form-singlefield-required", info.property.required, (val) => {
                        info.property.required = val
                    })
                    layui.tools.renderCheck("#form-singlefield-filter", info.property.filter, (val) => {
                        info.property.filter = val
                    })
                    layui.tools.renderText("#form-singlefield-label", info.property.placeholder, { placeholder: '多选框标签' }, (val) => {
                        info.property.placeholder = val
                    })
                    layui.tools.renderText("#form-singlefield-datasource", info.property.datasource, { placeholder: '远程数据源' }, (val) => {
                        info.property.datasource = val
                    })
                },
                yes: function (index, layero, that) {
                    if (!layui.dataTable.verifyOptions(optid)) {
                        layui.layer.msg("选项列表数据字段不能为空")
                        return
                    }
                    info.property.options = layui.dataTable.getData(optid)
                    EditorDocs.changeCompInfo(info)
                    layui.layer.close(index);
                },
                end: function () {
                    EditorDocs.refresh()
                }
            });
        })
    },
    openMultipleFieldCompForm: function (compID) {
        const $ = layui.$
        $.get("./form/component/multipleFieldComponent.html", function (data) {
            const info = EditorDocs.getCompInfo(compID)
            const idfid = "#form-multiplefield-identifier"
            const optid = '#form-multiplefield-options'
            layui.layer.open({
                type: 1,
                title: '多选选择域组件属性编辑',
                skin: 'layui-layer-win10', // 2.8+
                area: ['510px', '450px'],
                btn: ['保存', '关闭'],
                content: data,
                success: function (layero, index, that) {
                    layui.tools.renderText("#form-multiplefield-code", info.property.code, { placeholder: '结构化数据编码' }, (val) => {
                        info.property.code = val
                    })
                    layui.tools.renderText("#form-multiplefield-describe", info.property.describe, { placeholder: '描述说明' }, (val) => {
                        info.property.describe = val
                    })
                    layui.dataTable.renderOptions({
                        elem: optid,
                        data: info.property.options,
                        addbtn: '#form-multiplefield-addo',
                        delbtn: '#form-multiplefield-deto',
                    })
                    layui.tools.renderCheck("#form-multiplefield-detete", info.property.deletable, (val) => {
                        info.property.deletable = val
                    })
                    layui.tools.renderCheck("#form-multiplefield-required", info.property.required, (val) => {
                        info.property.required = val
                    })
                    layui.tools.renderCheck("#form-multiplefield-filter", info.property.filter, (val) => {
                        info.property.filter = val
                    })
                    layui.tools.renderText("#form-multiplefield-label", info.property.placeholder, { placeholder: '多选框标签' }, (val) => {
                        info.property.placeholder = val
                    })
                    layui.tools.renderText("#form-multiplefield-datasource", info.property.datasource, { placeholder: '远程数据源' }, (val) => {
                        info.property.datasource = val
                    })
                    layui.tools.renderText("#form-multiplefield-separator", info.property.separator, { placeholder: '分隔符' }, (val) => {
                        info.property.separator = val
                    })
                },
                yes: function (index, layero, that) {
                    if (!layui.dataTable.verifyOptions(optid)) {
                        layui.layer.msg("选项列表数据字段不能为空")
                        return
                    }
                    info.property.options = layui.dataTable.getData(optid)
                    EditorDocs.changeCompInfo(info)
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
        $.get("./form/system/aboutForm.html", function (data) {
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