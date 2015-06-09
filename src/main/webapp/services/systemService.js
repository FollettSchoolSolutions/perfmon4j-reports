app.factory('systemService', function($http, dbID){
	var factory = {};
	
	factory.getSystems = function(){
		var url = "http://172.16.16.64/perfmon4j/rest/datasource/databases/" + dbID + "systems";
		
		return $http.get(url).then(function(result){
			return result;
		})
	}
	
	return factory;
});