Dependency=new function(){
	//private variables
	var ajaxQuery=[];
	var ajaxLimit=2;
	/*Contains information about loaded, loading and problems when loading packages and it's dependencies.
	Every file loaded will be added to the tree only once.*/
	/*childrenSize is needed because some children return immediately, before all children nodes are created.
	Checking the children.length value would then be smaller than the actual number of children.*/
	var _basePath='.';
	var root={status:'loaded',content:null,parents:null,children:null,package:null,childrenSize:0};
	//private functions
	var addRequest=function(params){
		var queryObject={
			params:params,
			id:(ajaxQuery.length==0?0:ajaxQuery[ajaxQuery.length-1].id+1)
		};
		ajaxQuery.push(queryObject);
		tryQuery(ajaxQuery.length-1);
	}
	var tryQuery=function(index){
		var queryObject=ajaxQuery[index];
		if(index<=ajaxLimit-1){
			if(index<=ajaxQuery.length-1){
				jQuery.ajax(ajaxQuery[index].params)
					.complete(function(){removeRequest(queryObject.id)});
			}
		}
	}
	var removeRequest=function(id){
		for(var index=0;index<ajaxQuery.length;index++){
			if(ajaxQuery[index].id==id){
				ajaxQuery.splice(index,1);
				tryQuery(ajaxLimit-1);
				break;
			}
		}
	}
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
		var node={};
		var base;
		if(baseNode==null){
			base=root;
		}else{
			base=baseNode;
		}
		node.children=null;
		node.package=package;
		node.childrenSize=0;
		addParent(node,base);
		return node;
	}
	var checkParentsLoading=function(node){
		if(node.parents!=null){
			for(var index=0;index<node.parents.length;index++){
				/*If parent already loaded, stop propagation up the tree*/
				if(node.parents[index].status!="loaded"){
					checkLoading(node.parents[index]);
				}
			}
		}		
	}
	/*Called by children when their status changes.*/
	var checkLoading=function(node){
		/*Check status of dependencies of the node. If all are fulfilled then change status to 'loaded' or 'error' and run all callbacks.*/
		if(node.status!='loaded' && node.status!='error'){
			if(!hasDependencies(node)){
				node.status='loaded';
				/*root doesn't have content, so check if it exists. Other nodes will have content.*/
				if(node.content!=null){
					/*If an object, it will executed and the constructor returned.*/
					node.content=node.content();
				}
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
				if(loadedChildren==node.childrenSize){
					node.status='loaded';
					/*If an object, it will executed and the constructor returned.*/
					node.content=node.content();
					checkParentsLoading(node);
				}
			}
		}else{
			/*Notify parents that want this node when it's already loaded. This happens
			when you need a node later somewhere but you're not sure whether it's already
			loaded or not.*/
			checkParentsLoading(node);
		}
	}
	/*Parses the given string to a filepath.*/
	var parse=function(package){
		return _basePath+'/'+package.split('.').join('/')+'.js';
	}
	/*Searches for a specific node that was loaded and returns it. Recursive.*/
	var namespaceNode=function(package){
		return namespaceNodeStep(package,root);
	}
	var namespaceNodeStep=function(package,currentNode){
		if(currentNode.package==package){
			return currentNode;
		}else if(currentNode.children!=null){
			for(var index=0;index<currentNode.children.length;index++){
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
		if(settings.dependencies==null){
			/*No dependencies either, just run content.*/
			settings.content();
		}else{
			parentNode.childrenSize=settings.dependencies.length;
			/*There are dependencies. Search for them in the tree and add nodes if they do not exist.*/
			for(var index=0;index<settings.dependencies.length;index++){
				var node=namespaceNode(settings.dependencies[index]);
				if(node==null){
					/*This package was not requested yet, create a node for it and load it.*/
					node=addNode(parentNode,settings.dependencies[index]);
					node.status='loading';
					/*Load file.*/
					addRequest({
						dataType:'script',
						/*Set context to node do it can be received by the complete function easily.
						I problems with using the node local variable directly inside complete when there were many nodes created.
						Only the last one was references in all the places.*/
						context:node,
						url:parse(settings.dependencies[index]),
						complete:function(data){
							/*Check if the dependency created any new nodes (deeper dependencies). If not then check the status to "loaded"*/
							if(!hasDependencies(this)){
								checkLoading(this);
							}
						},
						error:function(jqXHR,textStatus,errorThrown){
							this.status='error';
							checkLoading(node);
						}
					});
				}else{
					/*This node already exists, add a new parent to it if it's still loading. If it is not loading
					then call content*/
					if(node.status=='loading'){
						addParent(node,parentNode);
					}else{
						addParent(node,parentNode);
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
		/*Assing null values to undefined variables.*/
		if(!settings){
			/*No settings defined, don't do a thing.*/
			return;
		}else{
			if(!settings.content)
				settings.content=function(){};
			if(!settings.base)
				settings.base=null;
			if(!settings.dependencies)
				settings.dependencies=null;
		}
		/*settings:base,content,dependencies*/
		if(settings.base==null){
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
			throw "Script not loaded.";
		}
	}
	/*Removes a loaded package along with it's dependencies if they are not used in other packages. Stops loading of those packages if it's necessary.
	If a user requests one of them again, the required files will be loaded again.*/
	this.unload=function(package){
		
	}
	/*Sets root directory for all script references.*/
	this.basePath=function(newValue){
		if(!newValue){
			return _basePath;
		}else{
			_basePath=newValue;
		}
	}
}();