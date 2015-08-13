package org.perfmon4jreports.app.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@NamedQueries({
	@NamedQuery(name=Chart.QUERY_FIND_ALL, query="SELECT c FROM Chart c")
})

@JsonIgnoreProperties(ignoreUnknown=true)
@Entity
public class Chart {
	
	public static final String QUERY_FIND_ALL = "Chart.findAll";
	
	@Id
	private String id;
	
	@Lob
	@Column(nullable = false, columnDefinition="LONGTEXT")
	// TODO make a clob column
	private String data;
	
	public Chart() {
	}
	
	public Chart(String id, String data) {
		setId(id);
		setData(data);
	}
	
	public void updateChart(Chart c){
		this.data = c.getData();
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	
	public String getData() {
		return data;
	}
	
	public void setData(String data) {
		this.data = data;
	}
	
}
