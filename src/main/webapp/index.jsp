<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<html>
<head>
    <title>GoJs-Demo</title>
</head>
<body>
    <jsp:forward page="html/demo1.jsp"></jsp:forward>
</body>
<script type="text/javascript">
<%--console.log(${ctx})--%>
</script>
</html>
