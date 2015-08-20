package org.perfmon4jreports.app.data;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@NamedQueries({
	@NamedQuery(name=DataSource.QUERY_FIND_ALL, query="Select l from DataSource l"),
	@NamedQuery(name=DataSource.QUERY_FIND_DataSources, query ="Select l from DataSource l WHERE l.UserID like :userID")
})	



@JsonIgnoreProperties(ignoreUnknown=true)
@Entity	

public class DataSource {
	public static final String QUERY_FIND_ALL = "DataSources.findAll";
	public static final String QUERY_FIND_DataSources = "DataSources.findDataSources";
	public static final String QUERY_FIND_USERID = "DataSources.findUserID";
	
	public DataSource() {}
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(nullable=false, unique=true)
	private int id;

	@Column(nullable = true, name = "Fields")
	private String Fields;
	

	@Column(nullable = false, name = "Name")
	private String Name;
	
	
	@Column(nullable = false, name = "URL", length=255)
	private String URL;
	
	@Column(nullable = false, unique=true, name = "UserID")
	private int UserID;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFields() {
		return Fields;
	}

	public void setFields(String fields) {
		Fields = fields;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getURL() {
		return URL;
	}

	public void setURL(String uRL) {
		URL = uRL;
	}

	public int getUserID() {
		return UserID;
	}

	public void setUserID(int userID) {
		UserID = userID;
	}
}
