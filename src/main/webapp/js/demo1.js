/**
 * Created by guanyiting on 2018/4/30 0030.
 */

/*Notice that go is the "namespace" in which all GoJS types reside.
All code uses of GoJS classes such as Diagram or Node or Panel or Shape
or TextBlock will be prefixed with "go."*/
//创建GoJs核心对象
var myMake=go.GraphObject.make;
//创建画布
var myDiagram=myMake(go.Diagram,"demoDiagram",
    {
        initialContentAlignment:go.Spot.Center,//内容居中展示
        "undoManager.isEnabled":true    //启用Ctrl-Z撤销和Ctrl-Y重做快捷键
    });

/*造型节点（Node）的几种组件：
 Shape:形状——Rectangle（矩形）、RoundedRectangle（圆角矩形），Ellipse（椭圆形），Triangle（三角形），Diamond（菱形），Circle（圆形）等
 TextBlock:文本域（可编辑）
 Picture:图片
 Panel:容器来保存其他Node的集合
 默认的节点模型代码只是由一个TextBlock组件构建成*/
myDiagram.nodeTemplate=
    myMake(
        go.Node,
        //第二个参数是 Node/Panel组件分布的布局方式，例子是垂直分布：Vertical，还有横向布局：Horizontal可选
        // "Horizontal",
        "Vertical",

        /* set Node properties here */
        {// the Node.location point will be at the center of each node
            // locationSpot:go.Spot.Center
            background:"#44CCFF"
        },

        /* add Bindings here */
        // 绑定节点坐标Node.location为Node.data.loc的值 Model对象可以通过Node.data.loc 获取和设置Node.location（修改节点坐标）
        // new go.Binding("location","loc"),

        /* add GraphObjects contained within the Node */
        myMake(
          go.Picture,
            // 设置图片的宽高
            // 红色的图片背景（可以避免没有图片或者图片是透明的）
            {margin:10,width:50,height:50,background:"blue"},
            //Picture.source与模型数据的source属性进行了数据绑定
            new go.Binding("source")
        ),
        // myMake(
        //     go.Shape,
        //     "RoundedRectangle",//定义形状，这是圆角矩形
        //     { /* set Shape properties here:Shape的参数。宽高颜色等等 */ },
        //     // 绑定 Shape.figure属性为Node.data.fig的值，Model对象可以通过Node.data.fig 获取和设置Shape.figure（修改形状）
        //     new go.Binding("figure","fig")
        // ),
        myMake(go.TextBlock,
            "Default text", //文本域的默认显示文本
            { /* 可以在此参数设置字体样式 */
                margin: 12, stroke: "white", font: "bold 16px sans-serif"
            },
            //TextBlock.text绑定了Node.data.key
            new go.Binding("text","name"))
    )
//多个不同样式的Node节点模板可以通过myDiagram.nodeTemplateMap.add(go.Node)添加,详情见api
/*通过以上组件构建节点，需要显示文本可以使用TextBlocks ，设置节点形可以使用Shapes ，但是：
 TextBlocks 不能包含image
 Shapes 不能包含text*/

//定义没有箭头的线条模板（默认有箭头）
myDiagram.linkTemplate=myMake(
    go.Link,
    //默认的动态线条效果：routing：go.Link.Normal
    //默认角度：corner：0
    {
        // routing:go.Link.Orthogonal,
        // corner:5
    },
    //线条的形状、粗细、颜色
    myMake(go.Shape,{strokeWidth:3,stroke:"#555"}),
    //默认定义的箭头，如果想在连接处添加其他的形状也可以通过修改toArrow的值做到
    myMake(go.Shape,{toArrow:"Standard",stroke:null})
);


/*GoJS除了简单的go.Model这个模型之外还提供多种Model绘制精密的各种连线图可以描绘出很多不同的关系：
 Model：最基本的
 GraphLinksModel ：高级点的动态连线图
 TreeModel：树形图的模型（从例子看好像用的不多）
 GraphLinksModel中为model.nodeDataArray提供model.linkDataArray为node节点连线保存数据模型信息，
 其实也是的一个JSON数组对象，每个线条都有两个属性 “to” 和 “from” 即Node节点的“key”值，
 两个属性代表两个key表示两个节点间的连线*/
var myModel=myMake(go.GraphLinksModel);

//在模型数据中，每个节点由一个js对象表示
myModel.nodeDataArray=[
    // 每个节点数据对象都可以持有任意的属性，但是最后模型会根据属性生成对应的节点模板
    // 比如这个例子中name、source
    {source:ctx+"/gojs-1.8.17/learn/cat1.png",name:"cat A",key:"A"},
    {source:ctx+"/gojs-1.8.17/learn/cat2.png",name:"cat B",key:"B"},
    {source:ctx+"/gojs-1.8.17/learn/cat3.png",name:"cat C",key:"C"},
    {source:ctx+"/gojs-1.8.17/learn/cat4.png",name:"cat D",key:"D"},
    {source:ctx+"/gojs-1.8.17/learn/cat5.png",name:"cat E",key:"E"},
    {/*空节点数据*/} //默认蓝色背景，默认文字
];

myModel.linkDataArray=[
    {from:"A",to:"B"},
    {from:"B",to:"D"},
    {from:"C",to:"E"},
    {from:"A",to:"C"}
]

//将模型（数据）绑定到图中
myDiagram.model=myModel;
