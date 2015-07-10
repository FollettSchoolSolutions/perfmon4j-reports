package org.perfmon4j.reports.app.data;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.perfmon4j.reports.app.entity.Series;

@JsonIgnoreProperties(ignoreUnknown=true)
public class SeriesVo {
	
	private String name;
	private String system;
	private String category;
	private String field;
	private String aggregationMethod;
	
	private boolean active; // to make resteasy happy since we're giving it an extra field
	
	public SeriesVo(){
	}
	
	public SeriesVo(Series s){
		this.name = s.getName();
		this.system = s.getSystem();
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

	public String getSystem() {
		return system;
	}

	public void setSystem(String system) {
		this.system = system;
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

}
