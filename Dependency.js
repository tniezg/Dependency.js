/**/
Dependency=new function(){
	//private variables
	/*Contains information about loaded, loading and problems when loading packages and it's dependencies.
	Every file loaded will be added to the tree only once.*/
	var root={status:'loaded',content:null,parents:null,children:null,package:null};
	//private functions
	/*Adds a parent to an existing node. When node changes then all its parents' callbacks will be called using checkLoading.*/
	var addParent=function(node,parent){
		if(node.parents==null){
			node.parents=[parent];
		}else{
			node.parents.push(parent);
		}
		if(parent.children==null){
			parent.children=[node];
		}else{
			parent.children.push(node);
		}
	}
	var hasDependencies=function(node){
		return node.children!=null;
	}
	/*Creates a node and attaches it to the tree. If called without any parameters then the node will be completely detached from the tree.
	If baseNode is null, then attached to the root directly.*/
	var addNode=function(baseNode,package){
		var node=new Object();
		var base;
		if(baseNode==null){
			base=root;
		}else{
			base=baseNode;
		}
		node.package=package;
		addParent(node,base);
	}
	var checkParentsLoading=function(node){
		if(node.parents!=null){
			for(var index=0;index<node.parents.length;index++){
				checkLoading(nodex.parents[index]);
			}
		}		
	}
	/*Called by children when their status changes.*/
	var checkLoading=function(node){
		/*Check status of dependencies of the node. If all are fulfilled then change status to 'loaded' or 'error' and run all callbacks.*/
		if(node.status!='loaded' && node.status!='error'){
			if(!hasDependencies(node)){
				node.status='loaded';
				node.content();
				checkParentsLoading(node);
			}else{
				var loadedChildren=0;
				for(var index=0;index<node.children.length;index++){
					if(node.children[index].status=='error'){
						node.status="error";
						checkParentsLoading(node);
						break;
					}else if(node.children[index].status=='loaded'){
						loadedChildren++;
					}
				}
				if(laodedChildren==node.children.length){
					node.status='loaded';
					node.content();
					checkParentsLoading(node);
				}
			}
		}
	}
	/*Parses the given string to a filepath.*/
	var parse=function(package){
		return package.split('.').join('/')+'.js';
	}
	/*Searches for a specific node that was loaded and returns it. Recursive.*/
	var namespaceNode=function(package){
		namespaceNodeStep(package,root);
	}
	var namespaceNodeStep=function(package,currentNode){
		if(currentNode.package==package){
			return currentNode;
		}else if(currentNode.children!=null){
			for(var index=0;index<<currentNode.children.length;index++){
				var child=namespaceNodeStep(package,currentNode.children[index]);
				if(child!=null){
					return child;
				}
			}
		}else{
			return null;
		}
	}
	/*Having a parent node created, manage all the necessary dependencies.*/
	var completeTree=function(parentNode,settings){
		parentNode.content=settings.content;
		if(!settings.dependencies){
			/*No dependencies either, just run content.*/
			settings.content();
		}else{
			/*There are dependencies. Search for them in the tree and add nodes if they do not exist.*/
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
						checkLoading(node);
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
		var node=namespaceNode(package);
		if(node!=null){
			return node.content;
		}else{
			return null;
		}
	}
	/*Removes a loaded package along with it's dependencies if they are not used in other packages. Stops loading of those packages if it's necessary.
	If a user requests one of them again, the required files will be loaded again.*/
	this unload=function(package){
		
	}
}();