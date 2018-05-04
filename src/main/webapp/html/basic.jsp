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
    <title>GoJs-demo1</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="${ctx}/gojs-1.8.17/assets/css/bootstrap.min.css">
    <style>
        .container,.nav,.content{padding: 0;margin: 0}
    </style>
    <script type="text/javascript" src="${ctx}/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/gojs-1.8.17/assets/js/bootstrap.min.js"></script>
    <%--<script type="text/javascript" src="${ctx}/gojs-1.8.17/release/go.js"></script>--%>
    <script type="text/javascript" src="${ctx}/gojs-1.8.17/release/go-debug.js"></script>
    <script type="text/javascript">
        var ctx='${ctx}';
    </script>
</head>
<body class="container-fluid" onload="init()">
    <div class="row">
        <div class="col-sm-2 col-xs-2 nav">
            <b>菜单栏</b>
            <%--<ul>--%>
                <%--<li>1</li>--%>
                <%--<li>2</li>--%>
                <%--<li>3</li>--%>
            <%--</ul>--%>
        </div>
        <!-- The DIV for a Diagram needs an explicit size or else we will not see anything.
         In this case we also add a background color so we can see that area. -->
        <div class="col-sm-10 col-xs-10">
            <div style="height: 40px;background-color: #9d9d9d">
                <b>工具栏</b>
            </div>
            <div class="content" id="basicDiagram"
                style="width:1030px;height:520px;background-color: #DAE4E4;"></div>
        </div>
    </div>

    <%--注意此处用双标签引用js--%>
    <script type="text/javascript" src="${ctx}/js/basic.js"></script>
</body>


</html>
