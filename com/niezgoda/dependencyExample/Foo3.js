Dependency.resolve({base:'com.niezgoda.dependencyExample.Foo3',dependencies:['com.niezgoda.dependencyExample.Foo4','com.niezgoda.dependencyExample.Foo5','com.niezgoda.dependencyExample.Foo6'],content:function(){
	var foo3=function(){
	};
	foo3.prototype.foo3=function(){
		alert("foo3 called. Calling foo5 and foo4");
		new (Dependency.namespace('com.niezgoda.dependencyExample.Foo5'))().foo5();
		new (Dependency.namespace('com.niezgoda.dependencyExample.Foo4'))().foo4();
	}
	return foo3;
}})