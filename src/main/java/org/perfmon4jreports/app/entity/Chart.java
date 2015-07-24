package org.perfmon4jreports.app.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.perfmon4jreports.app.data.ChartVo;
import org.perfmon4jreports.app.data.SeriesVo;

@NamedQueries({
	@NamedQuery(name=Chart.QUERY_FIND_ALL, query="SELECT c FROM Chart c")
})

@JsonIgnoreProperties(ignoreUnknown=true)
@Entity
public class Chart {
	
	public static final String QUERY_FIND_ALL = "Chart.findAll";
	
	@Id
    @SequenceGenerator(name = "chartIDGenerator", initialValue = 1, allocationSize = 100)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chartIDGenerator")
    @Column(unique = true, nullable = false, name = "CHART_ID")
	private long id;
	
	@Column(nullable = false)
	private String chartName;
	
	@Column(nullable = false)
	private String chosenDatasource;
	
	@Column(nullable = false)
	private String chosenDatabase;
	
	@Column(nullable = false)
	private String timeStart;
	
	@Column(nullable = false)
	private String timeEnd;
	
	@OneToMany(fetch = FetchType.LAZY, cascade=CascadeType.ALL)
	@JoinColumn(name = "CHART_ID")
	private List<Series> series;
	
	public Chart(){
	}
	
	public Chart(ChartVo vo) {
		this.chartName = vo.getChartName();
		this.chosenDatasource = vo.getChosenDatasource();
		this.chosenDatabase = vo.getChosenDatabase();
		this.timeStart = vo.getTimeStart();
		this.timeEnd = vo.getTimeEnd();
		setSeriesFromVo(vo.getSeries());
	}
	
	public ChartVo toVo() {
		ChartVo vo = new ChartVo();
		vo.setId(id);
		vo.setChartName(chartName);
		vo.setChosenDatasource(chosenDatasource);
		vo.setChosenDatabase(chosenDatabase);
		vo.setTimeStart(timeStart);
		vo.setTimeEnd(timeEnd);
		vo.setSeriesFromEntity(series);
		return vo;
	}
	
	public List<Series> getSeries() {
		return series;
	}
	public void setSeries(List<Series> series) {
		this.series = series;
	}
	
	public void setSeriesFromVo(List<SeriesVo> series) {
		List<Series> list = new ArrayList<Series>();
		for(SeriesVo svo : series){
			Series s = new Series(svo);
			list.add(s);
		}
		this.series = list;
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

	public long getId() {
		return id;
	}
	
}
