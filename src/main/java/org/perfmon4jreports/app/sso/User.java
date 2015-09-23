package org.perfmon4jreports.app.sso;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@NamedQueries({
		@NamedQuery(name = User.QUERY_FIND_ALL, query = "Select l from User l"),
		@NamedQuery(name = User.QUERY_FIND_USER, query = "Select l from User l WHERE l.globalID like :globalID"),
		@NamedQuery(name = User.QUERY_FIND_USER_BY_USERID, query = "Select l from User l WHERE l.userID like :userID")
})
@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name="Users")
public class User {

	public static final String QUERY_FIND_ALL = "User.findAll";
	public static final String QUERY_FIND_USER = "User.findUser";
	public static final String QUERY_FIND_USER_BY_USERID = "User.findUserByUserID";

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(nullable = false, unique = true)
	private Integer userID;

	@Column(nullable = false, name = "Name")
	private String Name;

	@Column(nullable = false, name = "userName")
	private String userName;

	@Column(nullable = false, name = "domain")
	private String domain;

	@Column(nullable = false, unique = true, name = "globalID", length = 255)
	private String globalID;

	@Column(nullable = false, name = "email")
	private String email;

	public User() {

	}

	public Integer getUserID() {
		return userID;
	}

	public void setUserID(Integer userID) {
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
