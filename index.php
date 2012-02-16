Dependency examples.<br/>
<script src="./com/niezgoda/Dependency.js"></script>
<script src="./jquery-1.7.1.min.js"></script>
<a href="#" id="button1">No dependencies and no base.</a><br/>
<a href="#" id="button2">Single file dependency.</a><br/>
<a href="#" id="button3">Multiple file dependencies.</a><br/>
<a href="#" id="button4">More complicated file dependencies.</a>
<script>
$('#button1').click(function(){
	Dependency.resolve({content:function(){
		alert('This is a script that doesn\'t have dependencies.');
	}});
	return false;
});

$('#button2').click(function(){
	Dependency.resolve({dependencies:['com.niezgoda.dependencyExample.Foo'],content:function(){
		new (Dependency.namespace('com.niezgoda.dependencyExample.Foo'))().foo();
	}});
	return false;
});

$('#button3').click(function(){
	Dependency.resolve({dependencies:['com.niezgoda.dependencyExample.Foo','com.niezgoda.dependencyExample.Foo2'],content:function(){
		new (Dependency.namespace('com.niezgoda.dependencyExample.Foo'))().foo();
		new (Dependency.namespace('com.niezgoda.dependencyExample.Foo2'))().foo2();
	}});
	return false;
});

$('#button4').click(function(){
	Dependency.resolve({dependencies:['com.niezgoda.dependencyExample.Foo3','com.niezgoda.dependencyExample.Foo4'],content:function(){
		new (Dependency.namespace('com.niezgoda.dependencyExample.Foo3'))().foo3();
		new (Dependency.namespace('com.niezgoda.dependencyExample.Foo4'))().foo4();
	}});
	return false;
});
</script>