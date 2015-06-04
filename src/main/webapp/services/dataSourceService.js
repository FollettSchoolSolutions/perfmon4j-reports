app.factory('dataSourceService', function($http){
	var factory = {};
	
	factory.getDatabases = function(){
//		var url = "http://172.16.16.85:8080/RestDataSource/rest/datasource/databases";
		var url = "http://www.w3schools.com/angular/customers_sql.aspx";
		
		return $http.get(url).then(function(result){
			return result;
		})
	}
	
	return factory;
});