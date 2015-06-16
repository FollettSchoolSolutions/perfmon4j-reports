app.factory('dataSourceService', function($http){

	var urlPath = "/perfmon4j/rest/datasource";

	var factory = {};

	factory.getDataSources = function() {
		return $http.get("rest/datasources").then(function(result) {
			return result;
		});
	}

	factory.getDatabases = function(datasource) {
		console.log("then: " + datasource.host);
		var url = "http://" + datasource.host + urlPath + "/databases";

		return $http.get(url).then(function(result) {
			return result;
		});
	}

	factory.getSystems = function(datasource, database, timeStart, timeEnd) {
		var url = "http://" + datasource.host + urlPath + "/databases/"
				+ database.id + "/systems?timeStart=" + timeStart + "&timeEnd="
				+ timeEnd;
		console.log("Systems call: " + url)

		return $http.get(url).then(function(result) {
			return result;
		});
	}
	
	factory.getCategories = function(datasource, database, system, timeStart, timeEnd){
		var url = "http://" + datasource.host + urlPath + "/databases/"
		+ database.id + "/categories?systemID=" + system.id + "&timeStart=" + timeStart + "&timeEnd="
		+ timeEnd;	
		console.log("Systems call: " + url)
		
		return $http.get(url).then(function(result) {
			return result;
		});
	}
	
	factory.getFields = function(datasource, database, category){
		var url = "http://" + datasource.host + urlPath + "/databases/"
		+ database.id + "/categories/templates/" + category.templateName;
		console.log("Systems call: " + url)
		
		return $http.get(url).success(function(result){
			return result;
		})
	}

	return factory;
});