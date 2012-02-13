Dependency.resolve({base:'com.niezgoda.dependencyExample.Foo2',content:function(){
	var foo2=function(){
	};
	foo2.prototype.foo2=function(){
		alert('Foo2 function called.');
	}
	return foo2;
}})