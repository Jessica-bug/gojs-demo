/**
 * Created by guanyiting on 2018/5/4 0004.
 */

var saveModel = {};
/*{ "class": "go.GraphLinksModel",
 "linkFromPortIdProperty": "fromPort",
 "linkToPortIdProperty": "toPort",
 "nodeDataArray": [
 {"category":"Comment", "loc":"360 -10", "text":"Kookie Brittle", "key":-13},
 {"key":-1, "loc":"175 0", "text":"Start","type":"query"},
 {"key":0, "loc":"0 77", "text":"Preheat oven to 375 F","type":"table"},
 {"key":1, "loc":"175 100", "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt","type":"model"},
 {"key":2, "loc":"175 190", "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour","type":"model"},
 {"key":3, "loc":"175 270", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels","type":"model"},
 {"key":4, "loc":"175 370", "text":"Press evenly into ungreased 15x10x1 pan","type":"model"},
 {"key":5, "loc":"352 85", "text":"Finely chop 1/2 cup of your choice of nuts","type":"table"},
 {"key":6, "loc":"175 440", "text":"Sprinkle nuts on top","type":"touch"},
 {"key":7, "loc":"175 500", "text":"Bake for 25 minutes and let cool","type":"model"},
 {"key":8, "loc":"175 570", "text":"Cut into rectangular grid","type":"table"},
 {"key":-2, "loc":"175 640", "text":"Enjoy!","type":"model"}
 ],
 "linkDataArray": [
 {"from":1, "to":2, "fromPort":"B", "toPort":"T"},
 {"from":2, "to":3, "fromPort":"B", "toPort":"T"},
 {"from":3, "to":4, "fromPort":"B", "toPort":"T"},
 {"from":4, "to":6, "fromPort":"B", "toPort":"T"},
 {"from":6, "to":7, "fromPort":"B", "toPort":"T"},
 {"from":7, "to":8, "fromPort":"B", "toPort":"T"},
 {"from":8, "to":-2, "fromPort":"B", "toPort":"T"},
 {"from":-1, "to":0, "fromPort":"B", "toPort":"T"},
 {"from":-1, "to":1, "fromPort":"B", "toPort":"T"},
 {"from":-1, "to":5, "fromPort":"B", "toPort":"T"},
 {"from":5, "to":4, "fromPort":"B", "toPort":"T"},
 {"from":0, "to":4, "fromPort":"B", "toPort":"T"}
 ]};*/

var $$;
var basicDiagram;
var resultStat=false;

function init() {
    /**
     *  基本图形，basicDiagram
     */
    $$ = go.GraphObject.make;
    basicDiagram = $$(go.Diagram, 'basicDiagram',
        {
            //图像居中
            initialContentAlignment: go.Spot.Center,
            //使用鼠标的滚轮进行缩放
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            //允许双击背景创建新节点
            // "clickCreatingTool.archetypeNodeData": {text: "Node", color: "white"},
            //允许使用Ctrl+G调用groupSelection（）方法创建组
            "commandHandler.archetypeGroupData": {text: "Group", isGroup: true, color: "yellow"},
            //允许从另一个画布拖动
            allowDrop: true,
            "LinkDrawn": showLinkLabel,//这个DiagramEvent的监听事件在下方定义
            "LinkRelinked": showLinkLabel,
            scrollsPageOnFocus: false,
            //允许Ctrl+Z撤销Ctrl+Y恢复
            "undoManager.isEnabled": true
        }
    );

    //当文档被修改，添加一个‘*’到网页title，并且让‘保存’按钮生效
    basicDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById('saveBtn');
        // var button = $('#saveBtn');
        if (button) button.disabled = !basicDiagram.isModified;
        var idx = document.title.indexOf('*');
        if (basicDiagram.isModified) {
            if (idx < 0) document.title += '*';
        } else {
            if (idx > 0) document.title = document.title.substring(0, idx);
        }
    });

    //node Template的帮助器定义
    /*function nodeStyle() {
     return [
     //Node.location的值来自于节点数据的loc属性，由Point.parse静态方法转换
     //如果Node.location的值发生改变，由Point.stringify静态方法转换回来
     new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
     {
     //Node.location在每个节点的中心
     locationSpot: go.Spot.Center,
     // isShadowed:true,
     // shadowColor:'#888'
     //鼠标的enter/leave事件会show/hide端口
     mouseEnter: function (e, obj) {
     showPorts(obj.part, true)
     },
     mouseLeave: function (e, obj) {
     showPorts(obj.part, false)
     }
     }
     ];
     }*/

    //为规则节点定义Node templates
    var lightText = 'darkblue';//'lightblue';//'whitesmoke';

    //一个上下文菜单是一个包含一大堆按钮的饰物（adornment）
    var partContextMenu = $$(go.Adornment,
        "Vertical",
        makeButton("载入技战法",
            function (e, obj) {//obj就是这个按钮
                var div = e.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'treeDiv') return;

                var contextmenu = obj.part;//这个按钮在上下文菜单按钮之内
                var part = contextmenu.adornedPart;//adornedPart就是上下文菜单按钮所修饰的部分:node/link/group
                //现在可使用Part或其数据或上下文菜单按钮进行操作
                if (part instanceof go.Node) {
                    var content = part.data.content;
                    if (content != '') {
                        var basicModel = basicDiagram.model.toJson();
                        basicModel = eval('(' + basicModel + ')');
                        if (basicModel.nodeDataArray.length != 0) {
                            if (confirm('当前画布还存在节点，确定载入？')) {
                                basicDiagram.model = go.Model.fromJson(content);
                            }
                        } else {
                            basicDiagram.model = go.Model.fromJson(content);
                        }
                    }
                }
                // if(part instanceof go.Link) alert(linkInfo(part.data));
                // else if(part instanceof go.Group) alert(groupInfo(contextmenu));
                // else alert(nodeInfo(part.data));
            },
            function (o) {//只有节点为历史记录时，此功能菜单可见
                var div = o.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'treeDiv') return false;
                else {
                    var entity = o.data;
                    return entity.type == 'history' ? true : false;
                }
            }
        ),
        makeButton('条件查询',
            function (e, obj) {
                var div = e.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'basicDiagram') return;
            },
            function (o) {
                var div = o.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'basicDiagram') return false;
                else {
                    var entity = o.data;
                    return entity.type == 'table' ? true : false;
                }
            }
        ),
        makeButton('参数设置',
            function (e, obj) {
                var div = e.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'basicDiagram') return;
                var contextmenu = obj.part;//这个按钮在上下文菜单按钮之内
                var part = contextmenu.adornedPart;//adornedPart就是上下文菜单按钮所修饰的部分:node/link/group
                //现在可使用Part或其数据或上下文菜单按钮进行操作
                if (part instanceof go.Node) {
                    var params=eval('('+part.data.params+')');
                    if(!$.isEmptyObject(params)){//判断参数对象非空
                        paramSetting(params);
                    }else{
                        // window.toastr.info('该模型没有可变参数')
                        window.toastr['info']("该模型没有可变参数", "提示");
                    }
                }
            },
            function (o) {
                var div = o.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'basicDiagram') return false;
                else {
                    var entity = o.data;
                    return entity.type == 'model' ? true : false;
                }
            }
        ),
        makeButton('设置碰撞条件',
            function (e, obj) {
                var div = e.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'basicDiagram') return;
            },
            function (o) {
                var div = o.diagram.Ub.id;//获取当前Diagram所在div的id
                if (div != 'basicDiagram') return false;
                else {
                    var entity = o.data;
                    return entity.type == 'touch' ? true : false;
                }
            }
        ),
        makeButton("删除",
            function (e, obj) {
                var div = e.diagram.Ub.id;//获取当前Diagram所在div的id
                var contextmenu = obj.part;//这个按钮在上下文菜单按钮之内
                var part = contextmenu.adornedPart;//adornedPart就是上下文菜单按钮所修饰的部分:node/link/group
                //现在可使用Part或其数据或上下文菜单按钮进行操作
                if (part instanceof go.Node) {
                    // if(div=='treeDiv'&&part.data.type!='history')
                    //     return;
                    e.diagram.commandHandler.deleteSelection();
                }
            },
            function (o) {
                var div = o.diagram.Ub.id;//获取当前Diagram所在div的id
                var entity = o.data;
                if (div != 'basicDiagram' && entity.type != 'history') return false;
                else {
                    return o.diagram.commandHandler.canDeleteSelection();
                }
            }
        )
        /*,
         makeButton("剪切",
         function (e,obj) {e.diagram.commandHandler.cutSelection()},//点击触发剪切事件
         function(o){return o.diagram.commandHandler.canCutSelection()}//根据当前节点是否可剪切确定该按钮是否显示
         ),
         makeButton("复制",
         function (e,obj) {e.diagram.commandHandler.copySelection()},//点击触发复制事件
         function(o){return o.diagram.commandHandler.canCopySelection()}//根据当前节点是否可复制确定该按钮是否显示
         ),
         makeButton("粘贴",
         function (e,obj) {e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint)},
         function(o){return o.diagram.commandHandler.canPasteSelection()}//根据当前节点是否可粘贴确定该按钮是否显示
         ),
         makeButton("撤销",
         function (e,obj) {e.diagram.commandHandler.undo()},
         function(o){return o.diagram.commandHandler.canUndo()}
         ),
         makeButton("恢复",
         function (e,obj) {e.diagram.commandHandler.redo()},
         function(o){return o.diagram.commandHandler.canRedo()}
         ),
         makeButton("分组",
         function (e,obj) {e.diagram.commandHandler.groupSelection()},
         function(o){return o.diagram.commandHandler.canGroupSelection()}
         ),
         makeButton("撤销分组",
         function (e,obj) {e.diagram.commandHandler.ungroupSelection()},
         function(o){return o.diagram.commandHandler.canUngroupSelection()}
         )*/
    );

    basicDiagram.nodeTemplate = $$(go.Node, "Vertical",
        {locationObjectName: 'ICON', contextMenu: partContextMenu},
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $$(go.Picture,
            {
                width: 40, height: 40,
                margin: new go.Margin(0, 4, 0, 0),
                imageStretch: go.GraphObject.Uniform,
                portId: "", cursor: "pointer", //形状是端口，而不是整个节点
                fromLinkable: true, toLinkable: true,
            },
            new go.Binding('source', 'type', nodeTypeImage)
        ),
        $$(go.TextBlock,
            {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: lightText,
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: false
            },
            new go.Binding("text")/*.makeTwoWay()*/
        )
    );

    //替换默认的linkTemplateMap中的Link模板
    /*basicDiagram.linkTemplate = $$(go.Link,//整个Link面板
     {
     routing: go.Link.AvoidsNodes,
     curve: go.Link.JumpOver,
     corner: 5, toShortLength: 4,
     relinkableFrom: true,
     relinkableTo: true,
     reshapable: true,
     resegmentable: true,
     // mouse-overs subtly highlight links:
     mouseEnter: function (e, link) {
     link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
     },
     mouseLeave: function (e, link) {
     link.findObject("HIGHLIGHT").stroke = "transparent";
     }
     },
     new go.Binding("points").makeTwoWay(),
     $$(go.Shape,//高亮形状，通常状态透明（transparent）
     {isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}
     ),
     $$(go.Shape,//Link路径形状
     {isPanelMain: true, stroke: "gray", strokeWidth: 2}
     ),
     $$(go.Shape,//箭头的形状
     {toArrow: "standard", stroke: null, fill: "gray"}
     ),
     $$(go.Panel, "Auto",
     {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
     new go.Binding("visible", "visible").makeTwoWay(),//双向绑定
     $$(go.Shape, "RoundedRectangle",     //标签形状
     {fill: "#F8F8F8", stroke: null}),
     $$(go.TextBlock, "Yes",              //标签
     {
     textAlign: "center",
     font: "10pt helvetica, arial, sans-serif",
     stroke: "#333333",
     editable: true
     },
     new go.Binding("text").makeTwoWay()
     )
     )
     );*/

    //当从判断节点出发的节点，link的标签将可见，这个监听方法被‘LinkDrawn’和‘LinkRelinked’DiagramEvents事件触发；
    function showLinkLabel(e) {
        var label = e.subject.findObject('LABEL');
        if (label != null) label.visible = (e.subject.fromNode.data.figure == "Diamond");
    }

    //LinkTool与ReLinkTool使用的临时链接(temporary link)也是正交的
    basicDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    basicDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;


    //从一些json文本载入初始图形
    load();

    //=============================treeDiagram=================================================
    //定义节点的行为表现方式
    //第一步,定义一个对node,link,group 通用的文本菜单
    //为简化代码我们定义一个方法用于创建文本菜单按钮
    function makeButton(text, action, visiblePredicate) {
        return $$("ContextMenuButton",
            $$(go.TextBlock, text),
            {click: action},
            //如果没有visiblePredicate参数，不要绑定GraphObject.visible属性
            visiblePredicate ? new go.Binding("visible", "", function (o, e) {
                return o.diagram ? visiblePredicate(o, e) : false;
            }).ofObject() : {}
        )
    }

    //定义节点的表现行为
    function nodeInfo(d) {//node data对象的提示信息
        var str = "Node " + d.key + " : " + d.text + "\n";
        if (d.group) str += "member of " + d.group;
        else str += "top-level node";
        return str;
    }

    //初始化页面左边的调色板
    var treeDiagram = $$(go.Diagram, 'treeDiv',
        {
            //只允许往外拖拽、复制
            allowDragOut: true,
            allowCopy: true,
            allowMove: false,
            allowDrop: false,
            // allowDelete: false,
            allowInsert: false,
            allowHorizontalScroll: false,
            allowVerticalScroll: false,//不允许纵向滑动
            scrollsPageOnFocus: false,
            "commandHandler.deletesTree": false,
            // nodeTemplateMap: basicDiagram.nodeTemplateMap,//共享basicDiagram的nodeTemplateMap
            model: new go.TreeModel([  //指定调色板的内容
                {type: "open", text: "基础表", key: "1"},    //category：类别
                {type: "table", text: "表一", key: "2", parent: "1", tablename: "table1"},    //category：类别
                {type: "table", text: "表二", key: "3", parent: "1", tablename: "table2"},
                {type: "open", text: "筛查工具", key: "4"},
                {type: "touch", text: "碰撞", key: "5", parent: "4", data: ""},
                {type: "open", text: "基础模型库", key: "6"},    //category：类别,figure: 图形
                {type: "model", text: "模型一", key: "7", parent: "6", mid: "1356",params:"{}"},//"select * from table1 where jyje>10000"},
                {type: "model", text: "模型二", key: "8", parent: "6", mid: "1357",params:"{}"},//"select cxkh from table2 group by cxkh "},
                {type: "open", text: "历史记录", key: "9"},
                {
                    type: "history",
                    text: "历史一",
                    key: "10",
                    parent: "9",
                    content: "{ \"class\": \"go.GraphLinksModel\",\"nodeDataArray\": [{\"type\":\"table\", \"text\":\"表一\", \"key\":\"2\", \"parent\":\"1\", \"tablename\":\"table1\", \"loc\":\"-408.5520935058594 -244\"},{\"type\":\"model\", \"text\":\"模型一\", \"key\":\"7\", \"parent\":\"6\", \"mid\":\"1356\", \"params\":\"{}\",\"loc\":\"-274.5520935058594 -230\"}], \"linkDataArray\": [ {\"from\":\"2\", \"to\":\"7\"} ]}"
                }
            ]),
            layout: $$(go.TreeLayout,
                {
                    alignment: go.TreeLayout.AlignmentStart,
                    angle: 0,
                    compaction: go.TreeLayout.CompactionNone,
                    layerSpacing: 16,
                    layerSpacingParentOverlap: 1,
                    nodeIndent: 2,
                    nodeIndentPastParent: 0.88,
                    nodeSpacing: 0,
                    setsPortSpot: false,
                    setsChildPortSpot: false
                }
            )
        }
    );

    treeDiagram.nodeTemplate = $$(go.Node,
        {
            //no Adornment:通过Node.isSelected改变panel的背景色
            selectionAdorned: false,
            //一个允许双击时展开、折叠的自定义函数，使用与TreeExpanderButton逻辑类似
            doubleClick: function (e, node) {
                var cmd = treeDiagram.commandHandler;
                if (node.isTreeExpanded) {
                    if (!cmd.canCollapseTree(node)) return;
                } else {
                    if (!cmd.canExpandTree(node)) return;
                }
                e.handled = true;
                if (node.isTreeExpanded) {
                    cmd.collapseTree(node);
                } else {
                    cmd.expandTree(node);
                }
            }
        },
        $$("TreeExpanderButton",
            {
                width: 14,
                "ButtonBorder.fill": "whitesmoke",
                "ButtonBorder.stroke": null,
                "_buttonFillOver": "rgba(0,128,255,0.25)",
                "_buttonStrokeOver": null
            }
        ),
        $$(go.Panel, "Horizontal",
            {position: new go.Point(16, 0)},
            new go.Binding("background", "isSelected", function (s) {
                return (s ? "lightblue" : "white");
            }).ofObject(),
            $$(go.Picture,
                {
                    width: 18, height: 18,
                    margin: new go.Margin(0, 4, 0, 0),
                    imageStretch: go.GraphObject.Uniform
                },
                //使用图片的两个属性去绑定图片源，来展示打开、关闭的文件夹或文档
                new go.Binding("source", "isTreeExpanded", imageConverter).ofObject(),
                new go.Binding("source", "isTreeLeaf", imageConverter).ofObject()
            ),
            $$(go.TextBlock,
                {font: '9pt Verdana, sans-serif'},
                new go.Binding("text"
                    /*, "key", function (s) {
                     return "item " + s;
                     }*/
                )
            )
        ),//end Horizontal Panel
        {
            //这些提示修饰被所有node共享
            // toolTip:$$(go.Adornment,"Auto",
            //     $$(go.Shape,{fill:"#FFFFCC"}),
            //     //提示信息内容为访问nodeInfo（d）的结果
            //     $$(go.TextBlock,{margin:4},
            //         new go.Binding("text","",nodeInfo)
            //     )
            // ),
            //这个上下文菜单修饰被所有node共享
            contextMenu: partContextMenu
        }
    );//end Node

    //没有line
    treeDiagram.linkTemplate = $$(go.Link);
    //有line
    treeDiagram.linkTemplate = $$(go.Link,
        {
            selectable: false,
            routing: go.Link.Orthogonal,
            fromEndSegmentLength: 4,
            toEndSegmentLength: 4,
            fromSpot: new go.Spot(0.001, 1, 7, 0),
            toSpot: go.Spot.Left
        },
        $$(go.Shape,
            {stroke: 'gray', strokeDashArray: [1, 2]})
    );

}//====结束初始化==================

function imageConverter(propValue, picture) {
    var node = picture.part;
    var data = node.data;
    // console.log(node.Ud)//等价于node.data

    if (!node.isTreeLeaf) {
        if (node.isTreeExpanded)
            return ctx + "/gojs-1.8.17/samples/images/openFolder.png";
        else
            return ctx + "/gojs-1.8.17/samples/images/closedFolder.png";
    } else {
        // return ctx+"/gojs-1.8.17/samples/images/document.png";
        return nodeTypeImage(data.type);
    }
}

function nodeTypeImage(type, picture) {
    switch (type) {
        case "table":
            return ctx + "/image/file.png";//gojs-1.8.17/samples/images/voice atm switch.jpg";
        case "query":
            return ctx + "/gojs-1.8.17/samples/images/document.png";
        case "model":
            return ctx + "/image/database.png";
        case "touch":
            return ctx + "/image/toolset.png";
        case "cancel":
            return ctx + "/image/cancel.png";
        case "save":
            return ctx + "/image/save.png";
        case "history":
            return ctx + "/image/files.png";
        case "open":
            return ctx + "/gojs-1.8.17/samples/images/openFolder.png";
        case "close":
            return ctx + "/image/close.png";
        default:
            return ctx + "/gojs-1.8.17/samples/images/pc.jpg";
    }
    if (type.charAt(0) === "S") return
    if (type.charAt(0) === "P") return "images/general processor.jpg";
    if (type.charAt(0) === "M")
        return "images/pc.jpg";
}

function play() {
    var runModel=basicDiagram.model.toJson();
    console.log(runModel)

}

//以JSON格式显示用户可编辑的图表模型
function save() {
    saveModel = basicDiagram.model.toJson();
    console.log(saveModel)
    basicDiagram.isModified = false;
}

function load() {
    basicDiagram.model = go.Model.fromJson(saveModel);
    // console.log(basicDiagram.model)
}

function emptyDiagram() {
    var basicModel = basicDiagram.model.toJson();
    basicModel = eval('(' + basicModel + ')');
    if (basicModel.nodeDataArray.length != 0) {
        if (confirm('当前画布还存在节点，确定清空？')) {
            basicDiagram.model = go.Model.fromJson({});
        }
    } else {
        basicDiagram.model = go.Model.fromJson({});
    }
}

function paramSetting() {
    $("#compare_modal" ).draggable({
        handle: ".modal-header"
    });
    $("#compare_modal").modal("show");
}

// 在本页末尾添加图的SVG渲染
var obj;
function makeSVG() {
    var svg = basicDiagram.makeSvg({scale: 0.5});
    svg.style.border = '1px solid black';
    obj = document.getElementById("SvgArea");
    obj.appendChild(svg);
    // obj=$('#SvgArea');//这里jQuery对象不等同于html对象，所以js对象不能使用html的方法，html对象也不能使用js对象
    // obj.append(svg)    //$('#SvgArea')[0]

    if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
    }
}


//===============================右键属性菜单=====================================
/*
 //定义节点的行为表现方式
 //第一步,定义一个对node,link,group 通用的文本菜单
 //为简化代码我们定义一个方法用于创建文本菜单按钮
 function makeButton(text, action, visiblePredicate) {
 return $$("ContextMenuButton",
 $$(go.TextBlock, text),
 {click: action},
 //如果没有visiblePredicate参数，不要绑定GraphObject.visible属性
 visiblePredicate ? new go.Binding("visible", "", function (o, e) {
 return o.diagram ? visiblePredicate(o, e) : false;
 }).ofObject() : {}
 )
 }

 //一个上下文菜单是一个包含一大堆按钮的饰物（adornment）
 var partContextMenu = $$(go.Adornment,
 "Vertical",
 makeButton("属性",
 function (e, obj) {//obj就是这个按钮
 var contextmenu = obj.part;//这个按钮在上下文菜单按钮之内
 var part = contextmenu.adornedPart;//adornedPart就是上下文菜单按钮所修饰的部分:node/link/group
 //现在可使用Part或其数据或上下文菜单按钮进行操作
 if (part instanceof go.Link) alert(linkInfo(part.data));
 else if (part instanceof go.Group) alert(groupInfo(contextmenu));
 else alert(nodeInfo(part.data));
 }
 ),
 makeButton("剪切",
 function (e, obj) {
 e.diagram.commandHandler.cutSelection()
 },//点击触发剪切事件
 function (o) {
 return o.diagram.commandHandler.canCutSelection()
 }//根据当前节点是否可剪切确定该按钮是否显示
 ),
 makeButton("复制",
 function (e, obj) {
 e.diagram.commandHandler.copySelection()
 },//点击触发复制事件
 function (o) {
 return o.diagram.commandHandler.canCopySelection()
 }//根据当前节点是否可复制确定该按钮是否显示
 ),
 makeButton("粘贴",
 function (e, obj) {
 e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint)
 },
 function (o) {
 return o.diagram.commandHandler.canPasteSelection()
 }//根据当前节点是否可粘贴确定该按钮是否显示
 ),
 makeButton("删除",
 function (e, obj) {
 e.diagram.commandHandler.deleteSelection()
 },
 function (o) {
 return o.diagram.commandHandler.canDeleteSelection()
 }
 ),
 makeButton("撤销",
 function (e, obj) {
 e.diagram.commandHandler.undo()
 },
 function (o) {
 return o.diagram.commandHandler.canUndo()
 }
 ),
 makeButton("恢复",
 function (e, obj) {
 e.diagram.commandHandler.redo()
 },
 function (o) {
 return o.diagram.commandHandler.canRedo()
 }
 ),
 makeButton("分组",
 function (e, obj) {
 e.diagram.commandHandler.groupSelection()
 },
 function (o) {
 return o.diagram.commandHandler.canGroupSelection()
 }
 ),
 makeButton("撤销分组",
 function (e, obj) {
 e.diagram.commandHandler.ungroupSelection()
 },
 function (o) {
 return o.diagram.commandHandler.canUngroupSelection()
 }
 )
 )

 //定义节点的表现行为
 function nodeInfo(d) {//node data对象的提示信息
 var str = "Node " + d.key + " : " + d.text + "\n";
 if (d.group) str += "member of " + d.group;
 else str += "top-level node";
 return str;
 }

 //定义link的行为表现
 function linkInfo(data) {//link data关系数据对象的提示信息
 return "link：from " + data.from + " to " + data.to;
 }

 //定义group的表现行为
 function groupInfo(adornment) {     //拿到的是提示信息或者上下文菜单，不是一个group node data对象
 var g = adornment.adornedPart;  //获取提示信息修饰的group
 var mems = g.memberParts.count;
 var links = 0;
 g.memberParts.each(function (part) {
 if (part instanceof go.Link) links++;
 })
 return "group " + g.data.key + ":" + g.data.text + "\n" + mems + " members including " + links + " links";
 }

 //这些节点文字被圆角矩形包围
 //填充色取决于绑定的数据
 //用户可通过拖动TextBlock标签来拖动节点
 //从形状开始拖动将会创建一条新的link关系
 basicDiagram.nodeTemplate = $$(go.Node, "Auto",
 {locationSpot: go.Spot.Center},
 $$(go.Shape, "RoundedRectangle",
 {
 fill: "white",               //没有数据绑定时的默认填充色，
 portId: "", cursor: "pointer", //形状是端口，而不是整个节点
 //允许所有类型的links连接或被连接到这个端口
 fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
 toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
 },
 new go.Binding("fill", "color")
 ),
 $$(go.TextBlock,
 {
 font: "bold 14px sans-serif",
 stroke: "#333",
 margin: 6,           //给包裹文字的形状一些额外的空间
 isMultiline: false,  //不允许多行文本
 editable: true       //允许编辑
 },
 new go.Binding("text", "text").makeTwoWay()//标签显示节点数据的文本
 ),
 {//这些提示修饰被所有node共享
 toolTip: $$(go.Adornment, "Auto",
 $$(go.Shape, {fill: "#FFFFCC"}),
 //提示信息内容为访问nodeInfo（d）的结果
 $$(go.TextBlock, {margin: 4},
 new go.Binding("text", "", nodeInfo)
 )
 ),
 //这个上下文菜单修饰被所有node共享
 contextMenu: partContextMenu
 }
 );

 //link的形状和箭头将其笔触和笔刷绑定到color属性
 basicDiagram.linkTemplate = $$(go.Link,
 {toShortLength: 3, relinkableFrom: true, relinkableTo: true},//允许用户重新连接已存在的link
 $$(go.Shape,
 {strokeWidth: 2},
 new go.Binding("stroke", "color")
 ),
 $$(go.Shape,
 {toArrow: "Standard", stroke: null},
 new go.Binding("fill", "color")
 ),
 {//这个提示修饰被所有link共享
 toolTip: $$(go.Adornment, "Auto",
 $$(go.Shape, {fill: "#FFFFCC"}),
 //提示展示了访问linkInfo（data）方法的结果
 $$(go.TextBlock, {margin: 4},
 new go.Binding("text", "", linkInfo)
 )
 ),
 //上下文菜单修饰被所有link所共享
 contextMenu: partContextMenu
 }
 );

 //组包含由组节点数据给出的颜色标题，该数据位于围绕成员部件的半透明灰色矩形上方
 basicDiagram.groupTemplate = $$(go.Group, "Vertical",
 {
 selectionObjectName: "PANEL",//选择手柄绕过形状而不是标签
 ungroupable: true         //允许使用Ctrl+Shift+G取消分组
 },
 $$(go.TextBlock,
 {
 font: "bold 19px sans-serif",
 isMultiline: false,//不允许多行文本
 editable: true       //允许编辑
 },
 new go.Binding("text", "text").makeTwoWay(),
 new go.Binding("stroke", "color")
 ),
 $$(go.Panel, "Auto",
 {name: "PANEL"},
 $$(go.Shape, "Rectangle",//用矩形包含成员
 {
 fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 3,
 portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
 // allow all kinds of links from and to this port
 fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
 toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
 }
 ),
 $$(go.Placeholder, {margin: 10, background: "transparent"})//代表成员的位置
 ),
 {//这个toolTip修饰被所有group共享
 toolTip: $$(go.Adornment, "Auto",
 $$(go.Shape, {fill: "#FFFFCC"}),
 $$(go.TextBlock, {margin: 4}, //允许访问提示，而不是Group.data，允许访问Group的属性
 new go.Binding("text", "", groupInfo).ofObject()
 )
 ),
 //上下文菜单修饰被所有groups共享
 contextMenu: partContextMenu
 }
 );

 //定义Diagram background的行为表现
 function diagramInfo(model) {//diagram模型的提示信息
 return "Model:\n" + model.nodeDataArray.length + "nodes," + model.linkDataArray.length + " links";
 }

 //当鼠标不在任何控件上时为图表背景提供的提示信息
 basicDiagram.toolTip = $$(go.Adornment, "Auto",
 $$(go.Shape, {fill: "#FFFFCC"}),
 $$(go.TextBlock, {margin: 4},
 new go.Binding("text", "", diagramInfo))
 );

 //当鼠标不覆盖任何部分时，为图表背景提供上下文菜单
 basicDiagram.contextMenu = $$(go.Adornment, "Vertical",
 makeButton("粘贴",
 function (e, obj) {
 return e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint)
 },
 function (o) {
 return o.diagram.commandHandler.canPasteSelection()
 }
 ),
 makeButton("撤销",
 function (e, obj) {
 return e.diagram.commandHandler.undo()
 },
 function (o) {
 return o.diagram.commandHandler.canUndo()
 }
 ),
 makeButton("恢复",
 function (e, obj) {
 return e.diagram.commandHandler.redo()
 },
 function (o) {
 return o.diagram.commandHandler.canRedo()
 }
 )
 );

 //创建Diagram的model
 var nodeDataArray = [
 {key: 1, text: "a", color: "lightblue"},
 {key: 2, text: "b", color: "yellow"},
 {key: 3, text: "c", color: "blue", group: 5},
 {key: 4, text: "d", color: "pink", group: 5},
 {key: 5, text: "e", color: "green", isGroup: true}
 ];

 var linkDataArray = [
 {from: 1, to: 2, color: "blue"},
 {from: 2, to: 2},
 {from: 1, to: 3, color: "black"},
 {from: 3, to: 4, color: "red"}
 ];

 basicDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
 */
//===============================end==============================================



