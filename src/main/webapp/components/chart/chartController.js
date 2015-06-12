app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.databases = {};
	$scope.chosenDatabase = "";
	$scope.systems = {};
	$scope.chosenSystem = "";
	

	
	
//	$scope.seriesDefinitions = [];
	
	var databasePromise = dataSourceService.getDatabases();
	databasePromise.then(function(result){
		$scope.databases = result.data;
	})
//	var systemPromise = systemService.getSystems();
//	systemPromise.then(function(result){
//		$scope.systems = result.data;
//	})
	$scope.showChart = function() {
		var stuffPromise = dataSourceService.getStuff();
		stuffPromise.then(function(result){
			var reportMetadata = {
					data: result.data,
					axis: {
				        x: {
				            type: 'timeseries',
				            tick: {
				                format: '%Y-%m-%dT%H:%M'
				            }
				        }
				    }		
			};
			
			$scope.chart = c3.generate(reportMetadata);
		})
		
	};
//	
//	$scope.addAnotherSeries = function {
//		var seriesDef = {
//			name : "someName",
//			datasystems : ["sys1", "sys2"],
//			dataCatefory : "",
//			aggregationType: "",
//			values = [...];
//				
//		};
//		$scope.seriesDefintions.push(seriesDef);
//		
//	}
	
	
	$scope.generateCompositeSeries  = function() {
		// for each in series
		// create a new series array
		// push name as first element
		// push values as subsequent elements
		// push series array onto master array
//		return  [
////['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
//['x', '2015-04-23T12:00','2015-04-23T11:59','2015-04-23T11:58','2015-04-23T11:57','2015-04-23T11:56','2015-04-23T11:55','2015-04-23T11:54','2015-04-23T11:53','2015-04-23T11:52','2015-04-23T11:51','2015-04-23T11:50','2015-04-23T11:49','2015-04-23T11:48','2015-04-23T11:47','2015-04-23T11:46','2015-04-23T11:45','2015-04-23T11:44','2015-04-23T11:43','2015-04-23T11:42','2015-04-23T11:41','2015-04-23T11:40','2015-04-23T11:39','2015-04-23T11:38','2015-04-23T11:37','2015-04-23T11:36','2015-04-23T11:35','2015-04-23T11:34','2015-04-23T11:33','2015-04-23T11:32','2015-04-23T11:31','2015-04-23T11:30','2015-04-23T11:29','2015-04-23T11:28','2015-04-23T11:27','2015-04-23T11:26','2015-04-23T11:25','2015-04-23T11:24','2015-04-23T11:23','2015-04-23T11:22','2015-04-23T11:21','2015-04-23T11:20','2015-04-23T11:19','2015-04-23T11:18','2015-04-23T11:17','2015-04-23T11:16','2015-04-23T11:15','2015-04-23T11:14','2015-04-23T11:13','2015-04-23T11:12','2015-04-23T11:11','2015-04-23T11:10','2015-04-23T11:09','2015-04-23T11:08','2015-04-23T11:07','2015-04-23T11:06','2015-04-23T11:05','2015-04-23T11:04','2015-04-23T11:03','2015-04-23T11:02','2015-04-23T11:01','2015-04-23T11:00','2015-04-23T10:59','2015-04-23T10:58','2015-04-23T10:57','2015-04-23T10:56','2015-04-23T10:55','2015-04-23T10:54','2015-04-23T10:53','2015-04-23T10:52','2015-04-23T10:51','2015-04-23T10:50','2015-04-23T10:49','2015-04-23T10:48','2015-04-23T10:47','2015-04-23T10:46','2015-04-23T10:45','2015-04-23T10:44','2015-04-23T10:43','2015-04-23T10:42','2015-04-23T10:41','2015-04-23T10:40','2015-04-23T10:39','2015-04-23T10:38','2015-04-23T10:37','2015-04-23T10:36','2015-04-23T10:35','2015-04-23T10:34','2015-04-23T10:33','2015-04-23T10:32','2015-04-23T10:31','2015-04-23T10:30'],
//['Throughput', 2407.48,2522.41,2286.5,2528.45,2302.5,2468.47,2256.47,2513.46,2350.49,2274.51,2163.53,2236.48,2060.55,2318.5,2471.46,2216.52,2281.47,1990.57,2112.54,2201.52,2323.5,1958.54,2248.51,2717.41,2308.5,2414.48,2184.49,2293.5,2866.38,2663.42,2712.41,2909.32,2782.6,2883.38,2867.38,3374.27,3514.24,2615.39,2889.37,2928.37,3297.29,2841.38,2911.32,3046.34,2488.46,2872.38,2849.38,2800.35,2802.39,2820.39,2671.42,2606,2958.36,3272.29,2976.36,2748.4,2580.06,2527.45,2894.37,2758.4,2665.38,2431.47,2657.42,2923.37,3042.34,3138.27,3030.34,2936.36,2533.45,2418.48,2697.37,2285.5,2324.5,2188.53,2211.52,2159.5,2291.5,2768.4,2292.5,2635.43,3534.18,3725.19,3677.2,3338.28,3187.81,3299.29,3274.24,3235.3,2761.4,2682.42,2752.4],
//['AverageDuration', 282,276,477,475,265,453,367,296,290,279,299,253,286,267,293,302,313,286,264,282,309,294,293,315,339,315,253,266,416,507,293,338,346,320,378,687,753,1480,1199,1377,1204,746,808,1141,438,813,479,857,617,532,565,312,374,809,397,1055,772,452,474,504,777,444,412,414,538,500,522,365,397,437,391,303,365,286,230,263,315,269,273,282,384,502,378,404,546,533,513,505,558,395,474],
//['MaxThreads', 34,28,31,40,41,46,38,44,28,32,25,26,27,29,31,28,30,25,26,26,27,25,26,32,40,87,30,27,36,58,28,44,44,44,55,68,86,92,92,121,95,77,79,92,58,70,45,57,59,54,121,37,37,94,47,106,80,42,49,48,61,56,40,40,52,52,48,54,42,38,38,28,36,45,23,23,33,107,27,30,47,57,46,42,53,54,79,50,56,40,46]
//];
//		console.log("something");
//		var masterArray = [];
//		var series = 'data/observation.json';
//		var seriesArray = [];
//		for (var key in series) {
//			console.log(key);
//			if (key === 'series') {
//				for (var key2 in key) {
//					if (key2 === 'alias') {json
//						seriesArray.push(key2['alias']);
//					}
//				}
//			} else {
//				seriesArray.push(key);
//			}	
//		}
//		for (var i in seriesArray) {
//			console.log(i);
//		}
		chart.load({
			url: 'http://172.16.16.64/perfmon4j/rest/datasource/databases/default/observations.c3?seriesDefinition=MFSS-DEVL.24~MFSS-DEVL.25~Interval.WebRequest~maxActiveThreads_MFSS-DEVL.24~MFSS-DEVL.25~Interval.WebRequest~averageDuration_MFSS-DEVL.24~MFSS-DEVL.25~JVM~systemCpuLoad&seriesAlias=Threads_Average_CPU'
		});
		//return 'http://172.16.16.64/perfmon4j/rest/datasource/databases/default/observations.c3?seriesDefinition=MFSS-DEVL.24~MFSS-DEVL.25~Interval.WebRequest~maxActiveThreads_MFSS-DEVL.24~MFSS-DEVL.25~Interval.WebRequest~averageDuration_MFSS-DEVL.24~MFSS-DEVL.25~JVM~systemCpuLoad&seriesAlias=Threads_Average_CPU';
	}
});