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
import org.perfmon4jreports.app.sso.github.Users;
import org.perfmon4jreports.app.data.DataSource;
import org.perfmon4jreports.app.data.DataSourceVo;
import org.perfmon4jreports.app.entity.Chart;

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
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)	
	public List<DataSource> getDataSources() {
		if (principalContext.getPrincipal() ==null){
			List test = null;
			return test;
		}
		else {
			int userID = (int) em.createNamedQuery("Users.findUserID").setParameter("globalID", principalContext.getPrincipal().getGlobalID()).getSingleResult();
			
			@SuppressWarnings("unchecked")
			List<DataSource> list= em.createNamedQuery(DataSource.QUERY_FIND_DataSources).setParameter("userID", userID).getResultList();
			
			StringBuilder retList = new StringBuilder("[");
			for (int i = 0; i < list.size(); i++) {
				if (i >= 0) {
					retList.append(list.get(i).getName());
					retList.append(",");
					retList.append(list.get(i).getURL());
				}
				
			}
			return list;
			}
	}
		//return Arrays.asList(new DataSourceVo[] { new DataSourceVo(
		//		"Test on MDAPP", "172.16.16.64"), new DataSourceVo(
			//	"Another MDAPP", "172.16.16.64")});
	
	
	// Delete
	@DELETE
	@Path("/{id}")
	public boolean deleteDataSource(@PathParam("id") Integer id) {
		DataSource data = em.find(DataSource.class, id);
		if (data == null) {
			return false;
		}
		else {
			em.remove(data);
		}
	return true;
		
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
