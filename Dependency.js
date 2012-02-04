/**/
Dependency=new function(){
	//private variables
	/*Contains information about loaded, loading and problems when loading packages and it's dependencies.
	Every file loaded will be added to the tree only once.*/
	var tree={status:'loaded',content:null,parents:null,children:null,callbacks:null};
	//private functions
	/*Adds a callback function to a loading package, so you can hookup multiple scripts that are dependent on
	the same files.*/
	var callback=function(package, callback){
		
	}
	/*Parses the given string to a filepath.*/
	var parse=function(package){
		
	}
	/*Searches for a specific node that was loaded and returns it.*/
	var namespaceNode=function(package){
		
	}
	/*Calls callback functions registered for a specific node when a file is loaded or when an error during
	loading happens.*/
	var announce=function(node){
		
	}
	//public functions
	/*Called when a dependency exists between javascript files. Can be called with a list of dependent files
	and they will be loaded asynchronously, all at once. After loading completes or fails the caller gets notified
	and may act according to the result of the operation.*/
	this.resolve=function(settings){
		
	}
	/*Stop ajax loading of dependent files for a specific script. Can be used for example when the user switches pages
	before the current one containing some scripts has loaded. */
	this.stop=function(package){
		
	}
	/*Searches for specified package. If it has been loaded successfully, then the constructor contained in the loaded package
	is returned.*/
	this.namespace=function(package){
		
	}
	/*Removes a loaded package along with it's dependencies. Stops loading of those packages if it's necessary.
	If a user requests one of them again, the required files will be loaded again.*/
	this unload=function(package){
		
	}
}();