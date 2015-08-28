package org.perfmon4jreports.app.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.Base64;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.PrincipalContext;
import org.perfmon4jreports.app.sso.SSODomain;
import org.perfmon4jreports.app.sso.github.Users;


@Stateless
public class UsersService {
	@PersistenceContext
	private EntityManager em;
	@Inject
	private PrincipalContext principalContext;
public UsersService(){};

@Transactional
public void Login(HttpServletRequest req){


	//Get current session info
	HttpSession session = req.getSession(true);
	//PrincpalContext is being removed. We need to get globalID from HTTPSession
	Principal currentPrincipal = Principal.getPrincipal(principalContext);
	principalContext.setPrincipal(currentPrincipal);
		if (session != null) {
			//Set session context
		
		//Query database to see if the globalID exists
			
			Query q = em.createNamedQuery(Users.QUERY_FIND_USER);
			q.setParameter("globalID", currentPrincipal.getGlobalID());
			List checkUser = q.getResultList();
			
		if (checkUser.isEmpty())
		{
			try{
			String Name;
			if(currentPrincipal.getName() == null)
			Name = currentPrincipal.getUserName();
			else
			Name = currentPrincipal.getName();
			
			String userName = currentPrincipal.getUserName();
			SSODomain objDomain = currentPrincipal.getDomain();
			String domain = objDomain.toString();
			String globalID = currentPrincipal.getGlobalID();
			String email = currentPrincipal.getEmailAddress();
			
			//Add GlobalID to database
			
			
			Users u = new Users();
			u.setName(Name);
			u.setUserName(userName);
			u.setDomain(domain);
			u.setGlobalID(globalID);
			u.setEmail(email);
			
			em.persist(u);
			long id = u.getUserID();
			Query q1 = em.createNamedQuery(Users.QUERY_FIND_ALL);
			List test = q1.getResultList();
			System.out.println(test.get(0));
			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println("unable to save to database");
			}
		}
		}
		}

	public void Logout() {
		//PrincpalContext is being removed. We need to removePrinicipal from HttpSession
		principalContext.getPrincipal().removePrincipal();
	
	}
}

