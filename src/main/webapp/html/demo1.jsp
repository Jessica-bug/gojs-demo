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
    <title>GoJs-demo1</title>
    <script type="text/javascript" src="${ctx}/jquery-1.11.2.min.js"></script>
    <%--<script type="text/javascript" src="${ctx}/gojs-1.8.17/release/go.js"></script>--%>
    <script type="text/javascript" src="${ctx}/gojs-1.8.17/release/go-debug.js"></script>
    <script type="text/javascript">
        var ctx='${ctx}';
    </script>
</head>
<body>
    <!-- The DIV for a Diagram needs an explicit size or else we will not see anything.
     In this case we also add a background color so we can see that area. -->
    <div id="demoDiagram"
        style="width:1000px;height:500px;background-color: #DAE4E4;"></div>

    <%--注意此处用双标签引用js--%>
    <script type="text/javascript" src="${ctx}/js/demo1.js"></script>
</body>


</html>
