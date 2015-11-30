package org.perfmon4jreports.app.service;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.User;

@Stateless
public class UsersService {
	@PersistenceContext
	private EntityManager em;

	public UsersService() {
	};

	@Transactional
	public void login(HttpSession session, Principal principal) {
		// Check to see if we already have a User record for this Principal.
		Query q = em.createNamedQuery(User.QUERY_FIND_USER);
		q.setParameter("globalID", principal.getGlobalID());
		User user = null;

		try {
			user = (User) q.getSingleResult();
		} catch (NoResultException ne) {
			// Ignore... Must create a new user.
		}
		
		if (user == null) {
			user = new User();
			user.setName(principal.getName());
			user.setUserName(principal.getUserName());
			user.setDomain(principal.getDomain().getName());
			user.setGlobalID(principal.getGlobalID());
			user.setEmail(principal.getEmailAddress());

			em.persist(user);
		}
		Principal.addPrincipal(session, principal, user);
	}

	public void logout(HttpSession session) {
		Principal.removePrincipal(session);
	}
}
