package org.perfmon4jreports.app.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.management.Query;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.perfmon4jreports.app.sso.PrincipalContext;
import org.perfmon4jreports.app.data.DataSource;
import org.perfmon4jreports.app.data.DataSourceVo;

@Stateless
@Path("/datasources")
public class DataSourceService {
	
		@PersistenceContext
		private EntityManager em;
		@Inject
		private PrincipalContext principalContext;
		
		
		//Save or Update
		@PUT
		@Path("/{name}")
		@Consumes(MediaType.APPLICATION_JSON)
		@Produces(MediaType.APPLICATION_JSON)
		public void saveDataSource(@PathParam("name") String name, String URL) {
			int userID = (int) em.createNamedQuery("Users.findUserID").setParameter("globalID", principalContext.getPrincipal().getGlobalID()).getSingleResult();
			DataSource d = new DataSource();
			d.setName(name);
			d.setURL(URL);
			d.setUserID(userID);
			em.persist(d);
			
			}	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)	
	public List<DataSourceVo> getDataSources() {
		// TODO This would be limited to data sources visible within my github
		// groups

		return Arrays.asList(new DataSourceVo[] { new DataSourceVo(
				"Test on MDAPP", "172.16.16.64"), new DataSourceVo(
				"Another MDAPP", "172.16.16.64")});
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)	
	@Consumes(MediaType.APPLICATION_JSON)	
	public DataSourceVo createDataSource(DataSourceVo vo) {
		// TODO perform database ops here
		return vo;
	}

	//@PUT
	//@Path("/{id}")
	//@Produces(MediaType.APPLICATION_JSON)	
	//@Consumes(MediaType.APPLICATION_JSON)	
	//public DataSourceVo updateDataSource(@PathParam("id") Long id, DataSourceVo data) {
		// TODO perform database ops here
	//	return data;
	//}
	
}
