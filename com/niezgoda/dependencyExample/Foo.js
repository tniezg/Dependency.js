Dependency.resolve({base:'com.niezgoda.dependencyExample.Foo',content:function(){
	var foo=function(){
	};
	foo.prototype.foo=function(){
		alert('Foo function called.');
	}
	return foo;
}});