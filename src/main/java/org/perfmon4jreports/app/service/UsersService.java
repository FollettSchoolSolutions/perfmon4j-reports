package org.perfmon4jreports.app.service;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.github.Users;

@Stateless
public class UsersService {

@PersistenceContext
private EntityManager em;

public void Login(HttpServletRequest req){


	//Get current session info
	HttpSession session = req.getSession(true);
	 //Get principals based off of current session
	Principal currentPrincipal = Principal.getPrincipal(session);

		if (session != null) {
		//Query database to see if the globalID exists
			try{
			Query q = em.createNamedQuery(Users.QUERY_FIND_ALL);
			q.setParameter("globalID", currentPrincipal.getGlobalID());
			List checkUser = q.getResultList();
			}catch(Exception ex)
			{
			ex.printStackTrace();;
			}
			String s = "";
		if (s.isEmpty())
		{
			try{
			//Add GlobalID to database
			em.getTransaction().begin();
			em.createNativeQuery("Insert Into Users(Name, userName, domain, globalID, email) VALUES("+currentPrincipal.getName()+","+currentPrincipal.getUserName()+","+currentPrincipal.getDomain()+","+currentPrincipal.getGlobalID()+","+currentPrincipal.getEmailAddress()+")");
			em.getTransaction().commit();
			em.close();
			System.out.println(currentPrincipal.getName()+","+currentPrincipal.getUserName()+","+currentPrincipal.getDomain()+","+currentPrincipal.getGlobalID()+","+currentPrincipal.getEmailAddress()+"saved to database");
			}
			catch (Exception e)
			{
				System.out.println("unable to save to database");
			}
		}
		
		}
		
	}
}
