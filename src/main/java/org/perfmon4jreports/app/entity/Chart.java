package org.perfmon4jreports.app.entity;

import javax.persistence.Column;
import javax.persistence.Entity;

import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.perfmon4jreports.app.sso.github.Users;


@NamedQueries({
	@NamedQuery(name=Chart.QUERY_FIND_ALL, query="SELECT c FROM Chart c where c.globalID LIKE :globalID OR c.globalID IS NULL")
})

@JsonIgnoreProperties(ignoreUnknown=true)
@Entity
public class Chart {
	
	public static final String QUERY_FIND_ALL = "Chart.findAll";
	
   // @SequenceGenerator(name = "chartIDGenerator", initialValue = 1, allocationSize = 100)
   // @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chartIDGenerator")
    @Column(unique = true, nullable = false, name = "CHART_ID")
    @Id
	private String id;
	
	
	@Column(nullable = true, unique= false, name = "globalID")
	private String globalID;
	
	
	@Lob
	@Column(nullable = false, columnDefinition="LONGTEXT")
	// TODO make a clob column
	private String data;
	
	public Chart() {
	}
	
	public Chart(String id, String data, String globalID) {
		setId(id);
		setData(data);
		setGlobalID(globalID);
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

	public String getGlobalID() {
		return globalID;
	}

	public void setGlobalID(String globalID) {
		this.globalID = globalID;
	}
	
}
