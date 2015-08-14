package org.perfmon4jreports.app.sso.github;

import javax.servlet.http.HttpSession;

import org.perfmon4jreports.app.entity.*;
import org.perfmon4jreports.app.sso.SSOConfig;
import org.perfmon4jreports.app.sso.Group;
import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.SSODomain;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.perfmon4jreports.app.data.ChartVo;
import org.perfmon4jreports.app.data.SeriesVo;
import org.perfmon4jreports.app.entity.Series;

@NamedQueries({
	@NamedQuery(name=Users.QUERY_FIND_ALL, query="Select l from Users l"),
	@NamedQuery(name=Users.QUERY_FIND_USER, query ="Select l from Users l WHERE l.globalID like :globalID")
	//@NamedQuery(name=Users.QUERY_INSERT_USER, query="INSERT INTO Users (Name, userName, domain, gobalID, email) VALUES( :name, :userName, :domain, :globalID, :email")
})

@JsonIgnoreProperties(ignoreUnknown=true)
@Entity	
public class Users {
	
	public static final String QUERY_FIND_ALL = "Users.findAll";
	public static final String QUERY_FIND_USER = "Users.findUser";
	public static final String QUERY_INSERT_USER = "Users.addUser";
	
	 @Id
	 @GeneratedValue(strategy = GenerationType.AUTO)
	 @Column(nullable=false, unique=true)
	private long userID;

	@Column(nullable = true, name = "Name")
	private String Name;
	

	@Column(nullable = false, name = "userName")
	private String userName;
	
	@Column(nullable = false, name = "domain")
	private String domain;
	
	@Column(nullable = false, unique=true, name = "globalID", length=255)
	private String globalID;
	
	@Column(nullable = false, name ="email")
	private String email;

	public Users(){
	
	}



public long getUserID() {
	return userID;
}

public void setUserID(long userID) {
	this.userID = userID;
}

public String getName() {
	return Name;
}

public void setName(String name) {
	Name = name;
}



public String getUserName() {
	return userName;
}

public void setUserName(String userName) {
	this.userName = userName;
}

public String getDomain() {
	return domain;
}

public void setDomain(String domain) {
	this.domain = domain;
}

public String getGlobalID() {
	return globalID;
}

public void setGlobalID(String globalID) {
	this.globalID = globalID;
}

public String getEmail() {
	return email;
}

public void setEmail(String email) {
	this.email = email;
}

}

