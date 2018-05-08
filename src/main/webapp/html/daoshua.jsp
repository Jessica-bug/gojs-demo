<%--
  Created by IntelliJ IDEA.
  User: guanyiting
  Date: 2018/4/30 0030
  Time: 下午 17:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<%--GoJs依赖于H5标准，需要声明页面使用标准为Html5--%>
<!DOCTYPE html><%--Html5 document type--%>
<html>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1"><%--页面自适应相关--%>
    <title>daoshua</title>
    <meta charset="UTF-8">
    <%--设置页面不缓存--%>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">

    <link rel="stylesheet" type="text/css" href="${ctx}/gojs-1.8.17/assets/css/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css" href="${ctx}/gojs-1.8.17/assets/css/bootstrap.min.css">
    <link href="${ctx}/metronic/global/plugins/bootstrap-toastr/toastr.min.css" rel="stylesheet"
          type="text/css"/>

    <style>
        .nav,.content{padding: 0;margin: 0}
        .glyphicon{margin-left: 20px;margin-top:10px; }
    </style>
    <%--<script type="text/javascript" src="${ctx}/jquery-1.11.2.min.js"></script>--%>
    <script type="text/javascript" src="${ctx}/gojs-1.8.17/assets/js/jquery.min.js"></script>
    <script type="text/javascript" src="${ctx}/gojs-1.8.17/assets/js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="${ctx}/gojs-1.8.17/assets/js/bootstrap.min.js"></script>
    <%--<script type="text/javascript" src="${ctx}/gojs-1.8.17/release/go.js"></script>--%>
    <script type="text/javascript" src="${ctx}/gojs-1.8.17/release/go-debug.js"></script>
    <script src="${ctx}/metronic/global/plugins/bootstrap-toastr/toastr.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        var ctx='${ctx}';
    </script>
</head>
<body class="container-fluid" onload="init()">
    <div class="row">
        <div class="col-sm-2 col-xs-2 nav">
            <b>菜单栏</b>
            <div id="treeDiv"
                 style="width:220px;height:550px; /*background-color: #DAE4E4;*/"></div><%--overflow:auto--%>
        </div>
        <!-- The DIV for a Diagram needs an explicit size or else we will not see anything.
         In this case we also add a background color so we can see that area. -->
        <div class="col-sm-10 col-xs-10">
            <div style="text-align: center;height: 40px;background-color: #fcfece">
                <%--<b>工具栏</b>--%>
                <a href="#" onclick="play()" id="playBtn"><span class="glyphicon glyphicon-play-circle"/><span>运行</span></a>
                <a href="#" onclick="save()" id="saveBtn"><span class="glyphicon glyphicon-floppy-disk"/><span>保存</span></a>
                <a href="#" onclick="emptyDiagram()" id="emptyBtn" ><span class="glyphicon glyphicon-trash"/><span>清空</span></a>
                <a href="#" id="showBtn"><span class="glyphicon glyphicon-floppy-disk"/><span>预览</span></a>
                <%--<a href="#" onclick="load()" id="loadBtn"><span class="	glyphicon glyphicon-pencil"/><span>载入</span></a>--%>
                <%--<input type="button" value="保存" onclick="save()" id="saveBtn">--%>
                <%--<input type="button" value="载入" onclick="load()" id="loadBtn">--%>
            </div>

            <div class="content" id="basicDiagram"
                style="width:1030px;height:520px;background-color: #ffffff;"></div>

            <input type="button" onclick="makeSVG()" value="展示SVG">
            <div id="SvgArea"></div>
        </div>
    </div>

    <div class="modal fade draggable-modal" id="compare_modal" tabindex="-1" role="basic"
         aria-hidden="true">
        <div class="modal-dialog" style="margin-top: 150px;width: 800px;" >
            <div class="modal-content">
                <div class="modal-header" style="height: 30px;">
                    <button style=" margin-top: -5px !important" type="button" class="close" data-dismiss="modal"
                            aria-hidden="true"></button>
                    <h4 style="margin-top: -12px;" class="modal-title">数据比对</h4>
                </div>
                <div class="modal-body" style="max-height:500px;overflow: auto">
                    <div id="container${param.tid}"></div>
                    <%--<jsp:include page="datacompare.jsp"></jsp:include>--%>
                </div>
                <div class="modal-footer">
                    <button type="button" style="margin-top: -10px;font-size: 12px" class="btn default"
                            data-dismiss="modal">取消
                    </button>
                    <button id="compare${param.tid}" type="button" style="margin-top: -10px;font-size: 12px"
                            class="btn btn-danger" data-dismiss="modal">比对
                    </button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <%--注意此处用双标签引用js--%>
    <script type="text/javascript" src="${ctx}/js/daoshua.js"></script>
</body>


</html>
