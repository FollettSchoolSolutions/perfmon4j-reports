package org.perfmon4j.reports.app.data;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.perfmon4j.reports.app.entity.Chart;
import org.perfmon4j.reports.app.entity.Series;

@JsonIgnoreProperties(ignoreUnknown=true)
public class ChartVo {
	private long Id;	
	private String chartName;
	private String chosenDatasource;
	private String chosenDatabase;
	private String timeStart;
	private String timeEnd;
	
	private List<SeriesVo> series;
	
	public ChartVo(){
	}
	
	public long getId() {
		return Id;
	}

	public void setId(long id) {
		Id = id;
	}

	public String getChartName() {
		return chartName;
	}

	public void setChartName(String chartName) {
		this.chartName = chartName;
	}

	public String getChosenDatasource() {
		return chosenDatasource;
	}

	public void setChosenDatasource(String chosenDatasource) {
		this.chosenDatasource = chosenDatasource;
	}

	public String getChosenDatabase() {
		return chosenDatabase;
	}

	public void setChosenDatabase(String chosenDatabase) {
		this.chosenDatabase = chosenDatabase;
	}

	public String getTimeStart() {
		return timeStart;
	}

	public void setTimeStart(String timeStart) {
		this.timeStart = timeStart;
	}

	public String getTimeEnd() {
		return timeEnd;
	}

	public void setTimeEnd(String timeEnd) {
		this.timeEnd = timeEnd;
	}

	public List<SeriesVo> getSeries() {
		return series;
	}

	public void setSeries(List<SeriesVo> series) {
		this.series = series;
	}
	
	public void setSeriesFromEntity(List<Series> series) {
		List<SeriesVo> list = new ArrayList<SeriesVo>();
		for(Series s : series){
			SeriesVo svo = new SeriesVo(s);
			list.add(svo);
		}
		this.series = list;
	}
	
	
}
