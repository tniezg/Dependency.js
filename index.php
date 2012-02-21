<!DOCTYPE html>
<html>
<head>
	<title>Dependency.js</title>
	<link href='http://fonts.googleapis.com/css?family=Homenaje' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Asap:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
	<script src="jQuery.js"></script>
	<script src="com/niezgoda/dependencyJs/Dependency.js"></script>
	<script>
		Dependency.resolve({dependencies:['examples']});
	</script>
	<style>
		body{margin:0;font-family:Asap, sans-serif;}
		img{margin:0;}
		a{text-decoration:none;}
		body>.content
		body>.content>.title{font-family:Homenaje, sans-serif;font-size:30px;}
	</style>
</head>
<body>
<div class="content">
	<div class="title">Dependency.js</div>
	<div class="description">Script for loading javascript files asynchronously and all the dependencies they need.</div>
	<div class="examples">
		Examples.<br/>
		<a href="#" id="button1">No dependencies and no base.</a><br/>
		<a href="#" id="button2">Single file dependency.</a><br/>
		<a href="#" id="button3">Multiple file dependencies.</a><br/>
		<a href="#" id="button4">More complicated file dependencies.</a>
	</div>
</body>
</html>