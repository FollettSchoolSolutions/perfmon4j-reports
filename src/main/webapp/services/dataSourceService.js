app.factory('dataSourceService', function($http){
	var factory = {};
	
	factory.getDatabases = function(){
		var url = "http://172.16.16.64/perfmon4j/rest/datasource/databases";
		
		return $http.get(url).then(function(result){
			return result;
		})
	}
	
	factory.getStuff = function(){
		var url = "http://172.16.16.64/perfmon4j/rest/datasource/databases/default/observations.c3?seriesDefinition=MFSS-DEVL.24~MFSS-DEVL.25~Interval.WebRequest~maxActiveThreads_MFSS-DEVL.24~MFSS-DEVL.25~Interval.WebRequest~averageDuration_MFSS-DEVL.24~MFSS-DEVL.25~JVM~systemCpuLoad&seriesAlias=Threads_Average_CPU";
		return $http.get(url).then(function(result){
			return result;
		})
	}
	
	
	return factory;
});