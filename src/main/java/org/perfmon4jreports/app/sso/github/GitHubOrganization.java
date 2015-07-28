package org.perfmon4jreports.app.sso.github;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
class GitHubOrganization {
	private String login;
	private String id;
	private String url;
	private String avitar_url;
	private String description;

	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getAvitar_url() {
		return avitar_url;
	}
	public void setAvitar_url(String avitar_url) {
		this.avitar_url = avitar_url;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	@Override
	public String toString() {
		return "GitHubOrganization [login=" + login + ", id=" + id + ", url="
				+ url + ", avitar_url=" + avitar_url + ", description="
				+ description + "]";
	}
	
	
}
