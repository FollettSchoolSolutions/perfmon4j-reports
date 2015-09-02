package org.perfmon4jreports.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.perfmon4jreports.app.data.DataSource;
import org.perfmon4jreports.app.sso.Principal;

@Stateless
@Path("/datasources")
public class DataSourceService {
	
		@PersistenceContext
		private EntityManager em;
		//Inject HTTPSession instead of PrincpalContext.  Refer to ChartService.java
		@Inject
		HttpSession session;		
		
	//Save or Update
	@PUT
	@Path("/{name}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void saveDataSource(@PathParam("name") String name, String URL) {
	//We need to get globalID from the current HTTP session instead of from PrincipalContext.
		Principal p = Principal.getPrincipal(session);
		if (p != null) {
			Integer userID = p.getLocalUser().getUserID();
			
			DataSource d = new DataSource();
			d.setName(name);
			d.setURL(URL);
			d.setUserID(userID);
			em.persist(d);
		}
	}	
	
	//Get DataSources for the homepage
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)	
	public List<DataSource> getDataSources() {
		List<DataSource> result = new ArrayList<>();
		
		// Change to HTTPSession.getPrincipal
		Principal p = Principal.getPrincipal(session);
		if (p != null) {
			@SuppressWarnings("unchecked")
			Integer userID = p.getLocalUser().getUserID();
			result = em.createNamedQuery(DataSource.QUERY_FIND_DataSources).setParameter("userID", userID).getResultList();
		}
	
		return result;
	}
		//These are here for reference.  Specifically, the IP address of the only working datasource.
		//return Arrays.asList(new DataSourceVo[] { new DataSourceVo(
		//		"Test on MDAPP", "172.16.16.64"), new DataSourceVo(
			//	"Another MDAPP", "172.16.16.64")});
	
	
	// Delete
	@DELETE
	@Path("/{id}")
	public boolean deleteDataSource(@PathParam("id") Integer id) {
		DataSource data = em.find(DataSource.class, id);
		List checkCharts = em.createNamedQuery(DataSource.QUERY_FIND_CHARTS).setParameter("dsID", id).getResultList();
		
		if(!checkCharts.isEmpty()){
			return false;			
		}
		if (data == null) {
			return false;
		}
		else {
			em.remove(data);
		}
	return true;
		
	}
	//Edit
	@PUT
	@Path("/{id}/{editName}")
	@Consumes(MediaType.APPLICATION_JSON)	
	@Produces(MediaType.APPLICATION_JSON)	
	public void editDataSource(@PathParam("id") Integer id, @PathParam("editName") String editName, String url) {
		//Find the DataSource in the database
		DataSource data = em.find(DataSource.class, id);
		data.setId(id);
		data.setName(editName);
		data.setURL(url);
		em.merge(data);
	}
	
}
