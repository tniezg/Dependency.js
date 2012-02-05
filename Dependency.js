/**/
Dependency=new function(){
	//private variables
	/*Adds a parent to an existing node. When node changes then all its parents' callbacks will be called using checkLoading.*/
	var addParent=function(node,parent){
		
	}
	var hasDependencies=function(node){
		return !node.dependencies;
	}
	/*Contains information about loaded, loading and problems when loading packages and it's dependencies.
	Every file loaded will be added to the tree only once.*/
	var root={status:'loaded',content:null,parents:null,children:null,callbacks:null};
	//private functions
	/*Creates a node and attaches it to the tree. If called without any parameters then the node will be completely detached from the tree.*/
	var addNode=function(baseNode,package){
		
	}
	/*Called by children when their status changes.*/
	var checkLoading=function(node){
		/*Check status of dependencies of the node. If all are fulfilled then change status to 'loaded' or 'error' and run all callbacks.*/
			//check dependencies status.
			//...announce(node);
		
		
		
		/*If node status changes then call all callbacks of parents.*/
		
		
		
		
		
	}
	/*Registers a callback function with a node. Children will call the callbacks when their status changes.*/
	var callbackNode=function(node){
		if(!node.callbacks){
			node.callbacks=[function(){checkLoading(node)}];
		}else{
			node.callbacks.unshift(function(){checkLoading(node));
		}
	}
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
	/*Having a parent node created, manage all the necessary dependencies.*/
	var completeTree=function(parentNode,settings){
		parentNode.content=settings.content;
		if(!settings.dependencies){
			/*No dependencies either, just run content.*/
			settings.content();
		}else{
			/*Anonymous parent node will control loading of its children.*/
			callbackNode(parentNode);
			/*There are dependencies. Search for them in the tree and add nodes if they do not exist. If they exist, add callbacks only.*/
			for(var index=0;index<settings.dependencies.length;index++){
				var node;
				if((node=namespaceNode(settings.dependencies[index]))==null){
					/*This package was not requested yet, create a node for it and load it.*/
					node=addNode(parentNode,settings.dependencies[index]);
					node.status='loading';
					/*Load file.*/
					jQuery.ajax({
						dataType:'script',
						url:parse(settings.dependencies[index]),
						complete:function(data){
							/*Check if the dependency created any new nodes(deeper dependencies). If not then check the status to "loaded"*/
							if(!hasDependencies(node)){
								checkLoading(node);
							}
						},
						error:function(jqXHR,textStatus,errorThrown){
							settings.dependencies[index].status="error";
							checkLoading(node);
						}
					});
				}else{
					/*This node already exists, add a new parent to it if it's still loading. If it is not loading
					then call content*/
					if(node.status=='loading'){
						addParent(node,parentNode);
					}else{
						announce(node);
					}
				}
			}
		}
	}
	
	//public functions
	/*Called when a dependency exists between javascript files. Can be called with a list of dependent files
	and they will be loaded asynchronously, all at once. After loading completes or fails the caller gets notified
	and may act according to the result of the operation.*/
	this.resolve=function(settings){
		/*settings:base,content,dependencies*/
		if(!settings.base || settings.base==null){
			/*settings.base not specified, the script run after all dependencies are loaded is not a constructor
			but a script. Scripts loading process unlike constructors cannot be traced by multiple callbacks. It's not
			kept on the tree at all but executed immediately and cannot be executed again. That is why we will add callbacks
			to all of the dependencies and when they're all loaded execute the script.*/
			/*Create an anonymous node. It will not be connected with the tree.*/
			var parentNode=addNode();
			completeTree(parentNode,settings);
		}else{
			/*settings.base specified, search for it on the tree and either return the content if it's loaded or add a
			callback if it's still being loaded.*/
			var parentNode=namespaceNode(settings.base);
			if(parentNode==null){
				/*settings.base not on the tree yet. Add it and load. Some of it's children might already be present on the
				tree, so check each of them and add the missing ones. For others - check if they're loading and either attach
				a callback or just make them announce that they're already loaded or had an error loading.*/
				parentNode=addNode(null,settings.base);
			}
			completeTree(parentNode,settings);
		}
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