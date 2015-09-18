package org.perfmon4jreports.app.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;


@NamedQueries({
	@NamedQuery(name=Chart.QUERY_FIND_ALL, query="SELECT c FROM Chart c where c.userID LIKE :userID OR c.userID is NULL"),
	@NamedQuery(name=Chart.QUERY_FIND_ALL_PUBLIC, query="SELECT c FROM Chart c where c.publiclyVisible = true")
})

@JsonIgnoreProperties(ignoreUnknown=true)
@Entity
public class Chart {
	
	public static final String QUERY_FIND_ALL = "Chart.findAll";
	public static final String QUERY_FIND_ALL_PUBLIC = "Chart.findAllPublic";
	
    @Column(unique = true, nullable = false, name = "CHART_ID")
    @Id
	private String id;
	
    @Column(nullable = false, unique= false, name = "publiclyVisible")
	private boolean publiclyVisible;
	
	@Column(nullable = true, unique= false, name = "userID")
	private Integer userID;
	
	@Lob
	@Column(nullable = false, columnDefinition="LONGTEXT")
	private String data;
	
	@Column(unique = false, nullable = true, name = "dataSourceID")
	private Integer dataSourceID;
	
	public Chart() {
	}
	
	public Chart(String id, String data, Integer userID, Integer dsid) {
		setId(id);
		setData(data);
		setUserID(userID);
		setDataSourceID(dsid);
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

	public Integer getUserID() {
		return userID;
	}

	public void setUserID(Integer userID) {
		this.userID = userID;
	}

	public Integer getDataSourceID() {
		return dataSourceID;
	}

	public void setDataSourceID(Integer dataSourceID) {
		this.dataSourceID = dataSourceID;
	}

	public boolean isPubliclyVisible() {
		return publiclyVisible;
	}

	public void setPubliclyVisible(boolean publiclyVisible) {
		this.publiclyVisible = publiclyVisible;
	}
	
}
