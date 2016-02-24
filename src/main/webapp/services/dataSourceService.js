app.factory('dataSourceService', function($http){

	var urlPath = "/perfmon4j/rest/datasource";

	var factory = {};

	factory.getDataSources = function() {
		return $http.get("rest/datasources").then(function(result) {
			return result; 
		});
	}
	
	factory.getDatabases = function(datasource) {
		if(datasource.url.indexOf("http") < 0){
			datasource.url = "http://" + datasource.url;
		}
		var url = datasource.url+ urlPath + "/databases";

		return $http.get(url).then(function(result) {
			return result;
		});
	}

	factory.getSystems = function(datasource, database, timeStart, timeEnd) {
		if(datasource.url.indexOf("http") < 0){
			datasource.url = "http://" + datasource.url;
		}
		var url = datasource.url + urlPath + "/databases/"
				+ database.id + "/systems?timeStart=" + timeStart + "&timeEnd="
				+ timeEnd;
		
		return $http.get(url).then(function(result) { //TODO remove then
			return result;
		});
		
	}
	
	factory.getCategories = function(datasource, database, system, timeStart, timeEnd){
		if(datasource.url.indexOf("http") < 0){
			datasource.url = "http://" + datasource.url;
		}
		var url = datasource.url + urlPath + "/databases/"
		+ database.id + "/categories?systemID=" + system + "&timeStart=" + timeStart + "&timeEnd="
		+ timeEnd;	
		return $http.get(url).then(function(result) {
			return result;
		});
	}
	
	factory.getURL = function(chosenDatasource, chosenDatabase, timeStart, timeEnd, seriesUrl, aliases){
		if(chosenDatasource.indexOf("http") < 0){
			chosenDatasource = "http://" + chosenDatasource;
		}
		var url = "";
		if (timeStart != "" && timeEnd != "") {
			url = chosenDatasource + "/perfmon4j/rest/datasource/databases/" + chosenDatabase
			+ "/observations.c3?seriesDefinition=" + seriesUrl + "&seriesAlias=" + aliases + "&timeStart=" + timeStart 
			+ "&timeEnd=" + timeEnd;
		} else {
			url = chosenDatasource + "/perfmon4j/rest/datasource/databases/" + seriesUrl 
			+ "&seriesAlias=" + aliases;
		}
		return $http.get(url).then(function(result){
			return result;
		})
	}

	factory.getFields = function(datasource, database, category){
		if(datasource.url.indexOf("http") < 0){
			datasource.url = "http://" + datasource.url;
		}
		var url = datasource.url + urlPath + "/databases/"
		+ database.id + "/categories/templates/" + category.templateName;
		return $http.get(url).success(function(result){
			return result;
		})
	}
	
	factory.saveDataSource = function(dataSource){
		return $http.put("rest/datasources/" + dataSource.name + "/" + dataSource.publiclyVisible, dataSource.URL).then(function(result) {
			return result;
		});
	}

	factory.deleteDataSource = function(id){
        return $http['delete']("rest/datasources/" + id).then(function(result) {
                return result;
        });
	}
	
	factory.editDataSource = function(dataSource){
		$http.put("rest/datasources/" + dataSource.id + "/" + dataSource.editName + "/" + dataSource.publiclyVisible, dataSource.URL).then(function(result) {
			return result;
		});
		return $http.put("rest/charts/updateAll/" + dataSource.id, dataSource.URL).then(function(result) {
			return result;
		});
	}
	return factory;
});