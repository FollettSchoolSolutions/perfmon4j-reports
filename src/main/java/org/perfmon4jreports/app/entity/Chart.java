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
	@NamedQuery(name=Chart.QUERY_FIND_ALL, query="SELECT c FROM Chart c where c.userID LIKE :userID OR c.userID is NULL")
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
	
	
	@Column(nullable = true, unique= false, name = "userID")
	private int userID;
	
	
	@Lob
	@Column(nullable = false, columnDefinition="LONGTEXT")
	private String data;
	
	public Chart() {
	}
	
	public Chart(String id, String data, int userID) {
		setId(id);
		setData(data);
		setUserID(userID);
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

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}
	
}
