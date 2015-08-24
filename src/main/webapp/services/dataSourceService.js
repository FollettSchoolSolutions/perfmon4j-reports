app.factory('dataSourceService', function($http){

	var urlPath = "/perfmon4j/rest/datasource";
	var name = "Test32";
	var URL  = "1.1.1.1";

	var factory = {};
	
	
	factory.saveDataSource = function(){
				return $http.put("rest/datasources/" + name, URL).then(function(result) {
				return result;
			});
		}

	factory.getDataSources = function() {
		return $http.get("rest/datasources").then(function(result) {
			return result;
		});
	}

	factory.getDatabases = function(datasource) {
		var url = "http://" + datasource.host + urlPath + "/databases";

		return $http.get(url).then(function(result) {
			return result;
		});
	}

	factory.getSystems = function(datasource, database, timeStart, timeEnd) {
		var url = "http://" + datasource.host + urlPath + "/databases/"
				+ database.id + "/systems?timeStart=" + timeStart + "&timeEnd="
				+ timeEnd;
		
		return $http.get(url).then(function(result) {
			return result;
		});
		
	}
	
	factory.getCategories = function(datasource, database, system, timeStart, timeEnd){
		var url = "http://" + datasource.host + urlPath + "/databases/"
		+ database.id + "/categories?systemID=" + system + "&timeStart=" + timeStart + "&timeEnd="
		+ timeEnd;	
		return $http.get(url).then(function(result) {
			return result;
		});
	}
	
	factory.getURL = function(chosenDatasource, chosenDatabase, timeStart, timeEnd, seriesUrl, aliases){
		var url = "";
		if (timeStart != "" && timeEnd != "") {
			url = "http://" + chosenDatasource + "/perfmon4j/rest/datasource/databases/" + chosenDatabase
			+ "/observations.c3?seriesDefinition=" + seriesUrl + "&seriesAlias=" + aliases + "&timeStart=" + timeStart 
			+ "&timeEnd=" + timeEnd;
		} else {
			url = "http://" + chosenDatasource + "/perfmon4j/rest/datasource/databases/" + seriesUrl 
			+ "&seriesAlias=" + aliases;
		}
		return $http.get(url).then(function(result){
			return result;
		})
	}

	factory.getFields = function(datasource, database, category){
		var url = "http://" + datasource.host + urlPath + "/databases/"
		+ database.id + "/categories/templates/" + category.templateName;
		return $http.get(url).success(function(result){
			return result;
		})
	}

	return factory;
});