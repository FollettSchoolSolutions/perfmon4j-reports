app.factory('dataSourceService', function($http){
	var factory = {};
	
	factory.getDatabases = function(){
		var url = "http://172.16.16.64/perfmon4j/rest/datasource/databases";
		
		return $http.get(url).then(function(result){
			return result;
		})
	}
	
	return factory;
});