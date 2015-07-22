package org.perfmon4jreports.app.data;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.perfmon4jreports.app.entity.Series;

@JsonIgnoreProperties(ignoreUnknown=true)
public class SeriesVo {
	
	private String name;
	private String systems;
	private String category;
	private String field;
	private String aggregationMethod;
	
	private boolean active; // to make resteasy happy since we're giving it an extra field
	private boolean secondaryAxis; // to make resteasy happy since we're giving it an extra field
	
	public SeriesVo(){
	}
	
	public SeriesVo(Series s){
		this.name = s.getName();
		this.systems = s.getSystems();
		this.category = s.getCategory();
		this.field = s.getField();
		this.aggregationMethod = s.getAggregationMethod();
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

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public boolean isSecondaryAxis() {
		return secondaryAxis;
	}

	public void setSecondaryAxis(boolean secondaryAxis) {
		this.secondaryAxis = secondaryAxis;
	}

}
