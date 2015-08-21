package org.perfmon4jreports.app.sso;

import java.io.Serializable;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpSession;

@SessionScoped
public class PrincipalContext implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -200655401915855586L;
	private Principal principal;
	
	public PrincipalContext() {
		super();		
	}
	
	public Principal getPrincipal(){
		return this.principal;
	}
	
	public void setPrincipal(Principal principal){
		this.principal = principal;
	}

}
