package org.perfmon4jreports.app.data;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@NamedQueries({
	@NamedQuery(name=DataSource.QUERY_FIND_ALL, query="Select l from DataSource l"),
	@NamedQuery(name=DataSource.QUERY_FIND_DataSources, query ="Select l from DataSource l WHERE l.UserID like :userID OR l.publiclyVisible = TRUE"), // TODO select all by userID, then all other public ones
	@NamedQuery(name=DataSource.QUERY_FIND_CHARTS, query="Select l.dataSourceID from Chart l WHERE l.dataSourceID like :dsID")
})	



@JsonIgnoreProperties(ignoreUnknown=true)

@Entity	
public class DataSource {
	public static final String QUERY_FIND_ALL = "DataSources.findAll";
	public static final String QUERY_FIND_DataSources = "DataSources.findDataSources";
	public static final String QUERY_FIND_USERID = "DataSources.findUserID";
	public static final String QUERY_FIND_CHARTS = "DataSources.findCharts";
	public DataSource() {}
	
	@Id
	@SequenceGenerator(name = "dataSourceID", initialValue = 1, allocationSize = 100)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dataSourceID")
	@Column(nullable=false, unique=true)
	private Integer id;	

	@Column(nullable = false, name = "Name")
	private String Name;
	
	
	@Column(nullable = false, name = "url", length=255)
	private String url;
	
	@Column(nullable = false, unique=false, name = "UserID")
	private int UserID;
	
	@Column(nullable = false, unique= false, name = "publiclyVisible")
	private boolean publiclyVisible;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getURL() {
		return url;
	}

	public void setURL(String uRL) {
		url = uRL;
	}

	public int getUserID() {
		return UserID;
	}

	public void setUserID(int userID) {
		UserID = userID;
	}

	public boolean isPubliclyVisible() {
		return publiclyVisible;
	}

	public void setPubliclyVisible(boolean publiclyVisible) {
		this.publiclyVisible = publiclyVisible;
	}
}
