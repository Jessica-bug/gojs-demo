/**
 * Created by guanyiting on 2018/4/30 0030.
 */
function init() {
    var $$=go.GraphObject.make;
    var basicDiagram=$$(go.Diagram,'basicDiagram',
        {
            //图像居中
            initialContentAlignment:go.Spot.Center,
            //允许双击背景创建新节点
            "clickCreatingTool.archetypeNodeData": {text:"Node",color:"white"},
            //允许使用Ctrl+G调用groupSelection（）方法创建组
            "commandHandler.archetypeGroupData":{text:"Group",isGroup:true,color:"yellow"},
            //允许Ctrl+Z撤销Ctrl+Y重做
            "undoManager.isEnabled":true
        }
    );

    //定义节点的行为表现方式
    //第一步,定义一个对node,link,group 通用的文本菜单
    //为简化代码我们定义一个方法用于创建文本菜单按钮
    function makeButton(text,action,visiblePredicate) {
        return $$("ContextMenuButton",
            $$(go.TextBlock,text),
            {click:action},
            //如果没有visiblePredicate参数，不要绑定GraphObject.visible属性
            visiblePredicate?new go.Binding("visible","",function (o,e) {
                return o.diagram?visiblePredicate(o,e):false;
            }).ofObject():{}
        )
    }

    //一个上下文菜单是一个包含一大堆按钮的饰物（adornment）
    var partContextMenu=$$(go.Adornment,
        "Vertical",
        makeButton("属性",
            function (e,obj) {//obj就是这个按钮
                var contextmenu=obj.part;//这个按钮在上下文菜单按钮之内
                var part=contextmenu.adornedPart;//adornedPart就是上下文菜单按钮所修饰的部分:node/link/group
                //现在可使用Part或其数据或上下文菜单按钮进行操作
                if(part instanceof go.Link) alert(linkInfo(part.data));
                else if(part instanceof go.Group) alert(groupInfo(contextmenu));
                else alert(nodeInfo(part.data));
            }
        ),
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
        makeButton("删除",
            function (e,obj) {e.diagram.commandHandler.deleteSelection()},
            function(o){return o.diagram.commandHandler.canDeleteSelection()}
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
        )
    )

    //定义节点的表现行为
    function nodeInfo(d) {//node data对象的提示信息
        var str="Node "+d.key+" : "+d.text+"\n";
        if(d.group) str+="member of "+d.group;
        else str+="top-level node";
        return str;
    }

    //定义link的行为表现
    function linkInfo(data) {//link data关系数据对象的提示信息
        return "link：from "+data.from+" to "+data.to;
    }

    //定义group的表现行为
    function groupInfo(adornment) {     //拿到的是提示信息或者上下文菜单，不是一个group node data对象
        var g=adornment.adornedPart;  //获取提示信息修饰的group
        var mems=g.memberParts.count;
        var links=0;
        g.memberParts.each(function (part) {
            if(part instanceof  go.Link) links++;
        })
        return "group "+g.data.key+":"+g.data.text+"\n"+mems+" members including "+links+" links";
    }

    //这些节点文字被圆角矩形包围
    //填充色取决于绑定的数据
    //用户可通过拖动TextBlock标签来拖动节点
    //从形状开始拖动将会创建一条新的link关系
    basicDiagram.nodeTemplate=$$(go.Node,"Auto",
        {locationSpot:go.Spot.Center},
        $$(go.Shape,"RoundedRectangle",
            {
                fill:"white",               //没有数据绑定时的默认填充色，
                portId:"",cursor:"pointer", //形状是端口，而不是整个节点
                //允许所有类型的links连接或被连接到这个端口
                fromLinkable:true,fromLinkableSelfNode:true,fromLinkableDuplicates:true,
                toLinkable:true,toLinkableSelfNode:true,toLinkableDuplicates:true
            },
            new go.Binding("fill","color")
        ),
        $$(go.TextBlock,
            {
                font:"bold 14px sans-serif",
                stroke:"#333",
                margin:6,           //给包裹文字的形状一些额外的空间
                isMultiline:false,  //不允许多行文本
                editable:true       //允许编辑
            },
            new go.Binding("text","text").makeTwoWay()//标签显示节点数据的文本
        ),
        {//这些提示修饰被所有node共享
            toolTip:$$(go.Adornment,"Auto",
                $$(go.Shape,{fill:"#FFFFCC"}),
                //提示信息内容为访问nodeInfo（d）的结果
                $$(go.TextBlock,{margin:4},
                    new go.Binding("text","",nodeInfo)
                )
            ),
            //这个上下文菜单修饰被所有node共享
            contextMenu:partContextMenu
        }
    );

    //link的形状和箭头将其笔触和笔刷绑定到color属性
    basicDiagram.linkTemplate=$$(go.Link,
        {toShortLength:3,relinkableFrom:true,relinkableTo:true},//允许用户重新连接已存在的link
        $$(go.Shape,
            {strokeWidth:2},
            new go.Binding("stroke","color")
        ),
        $$(go.Shape,
            {toArrow:"Standard",stroke:null},
            new go.Binding("fill","color")
        ),
        {//这个提示修饰被所有link共享
            toolTip:$$(go.Adornment,"Auto",
                $$(go.Shape,{fill:"#FFFFCC"}),
                //提示展示了访问linkInfo（data）方法的结果
                $$(go.TextBlock,{margin:4},
                    new go.Binding("text","",linkInfo)
                )
            ),
            //上下文菜单修饰被所有link所共享
            contextMenu:partContextMenu
        }
    );

    //组包含由组节点数据给出的颜色标题，该数据位于围绕成员部件的半透明灰色矩形上方
    basicDiagram.groupTemplate=$$(go.Group,"Vertical",
        {selectionObjectName:"PANEL",//选择手柄绕过形状而不是标签
            ungroupable:true         //允许使用Ctrl+Shift+G取消分组
        },
        $$(go.TextBlock,
            {
                font:"bold 19px sans-serif",
                isMultiline:false,//不允许多行文本
                editable:true       //允许编辑
            },
            new go.Binding("text","text").makeTwoWay(),
            new go.Binding("stroke","color")
        ),
        $$(go.Panel,"Auto",
            {name:"PANEL"},
            $$(go.Shape,"Rectangle",//用矩形包含成员
                {
                    fill:"rgba(128,128,128,0.2)",stroke:"gray",strokeWidth:3,
                    portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
                    // allow all kinds of links from and to this port
                    fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                    toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
                }
            ),
            $$(go.Placeholder,{margin:10,background:"transparent"})//代表成员的位置
        ),
        {//这个toolTip修饰被所有group共享
            toolTip:$$(go.Adornment,"Auto",
                $$(go.Shape,{fill:"#FFFFCC"}),
                $$(go.TextBlock,{margin:4}, //允许访问提示，而不是Group.data，允许访问Group的属性
                    new go.Binding("text","",groupInfo).ofObject()
                )
            ),
            //上下文菜单修饰被所有groups共享
            contextMenu:partContextMenu
        }
    );

    //定义Diagram background的行为表现
    function diagramInfo(model) {//diagram模型的提示信息
        return "Model:\n"+model.nodeDataArray.length+"nodes,"+model.linkDataArray.length+" links";
    }

    //当鼠标不在任何控件上时为图表背景提供的提示信息
    basicDiagram.toolTip=$$(go.Adornment,"Auto",
        $$(go.Shape,{fill:"#FFFFCC"}),
        $$(go.TextBlock,{margin:4},
        new go.Binding("text","",diagramInfo))
    );

    //当鼠标不覆盖任何部分时，为图表背景提供上下文菜单
    basicDiagram.contextMenu=$$(go.Adornment,"Vertical",
        makeButton("粘贴",
            function (e,obj) {return e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint)},
            function (o) {return o.diagram.commandHandler.canPasteSelection()}
        ),
        makeButton("撤销",
            function(e,obj){return e.diagram.commandHandler.undo()},
            function(o){return o.diagram.commandHandler.canUndo()}
        ),
        makeButton("恢复",
            function(e,obj){return e.diagram.commandHandler.redo()},
            function(o){return o.diagram.commandHandler.canRedo()}
        )
    );

    //创建Diagram的model
    var nodeDataArray=[
        {key:1,text:"a",color:"lightblue"},
        {key:2,text:"b",color:"yellow"},
        {key:3,text:"c",color:"blue",group:5},
        {key:4,text:"d",color:"pink",group:5},
        {key:5,text:"e",color:"green",isGroup:true}
    ];

    var linkDataArray=[
        {from:1,to:2,color:"blue"},
        {from:2,to:2},
        {from:1,to:3,color:"black"},
        {from:3,to:4,color:"red"}
    ];

    basicDiagram.model=new go.GraphLinksModel(nodeDataArray,linkDataArray);
}
