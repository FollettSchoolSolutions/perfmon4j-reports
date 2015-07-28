package org.perfmon4jreports.app.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.perfmon4jreports.app.data.SeriesVo;

@JsonIgnoreProperties(ignoreUnknown=true)
@Entity
public class Series {
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CHART_ID")
	private Chart chart;
	
	@Id
	@SequenceGenerator(name = "seriesIDGenerator", initialValue = 1, allocationSize = 100)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seriesIDGenerator")
	@Column(nullable = false)
	private long id;
	
	@Column(nullable = false)
	private String name;
	
	@Column(nullable = false)
	private String systems;
	
	@Column(nullable = false)
	private String category;
	
	@Column(nullable = false)
	private String field;
	
	@Column(nullable = false)
	private String aggregationMethod;
	
	@Column(nullable = false)
	 private boolean secondaryAxis;
	
	public Series(){
	}
	
	public Series(SeriesVo svo){
		this.name = svo.getName();
		this.systems = svo.getSystems();
		this.category = svo.getCategory();
		this.field = svo.getField();
		this.aggregationMethod = svo.getAggregationMethod();
		this.secondaryAxis = svo.isSecondaryAxis();
	}
	
	public Chart getChart() {
		return chart;
	}

	public void setChart(Chart chart) {
		this.chart = chart;
	}

	public long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSystems() {
		return systems;
	}

	public void setSystems(String systems) {
		this.systems = systems;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getAggregationMethod() {
		return aggregationMethod;
	}

	public void setAggregationMethod(String aggregationMethod) {
		this.aggregationMethod = aggregationMethod;
	}

	public boolean isSecondaryAxis() {
		return secondaryAxis;
	}	
	
	public void setSecondaryAxis(boolean secondaryAxis) {
		this.secondaryAxis = secondaryAxis;
	}
}
