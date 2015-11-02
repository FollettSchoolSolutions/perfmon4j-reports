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

import org.json.JSONObject;
import org.perfmon4jreports.app.data.DataSource;
import org.perfmon4jreports.app.entity.Chart;
import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
@Path("/datasources")
public class DataSourceService {
	
		@PersistenceContext
		private EntityManager em;
		
		private static final  Logger logger = LoggerFactory.getLogger(ChartService.class);
		
		@Inject
		HttpSession session;		
		
	//Save or Update
	@PUT
	@Path("/{name}/{publiclyVisible}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void saveDataSource(@PathParam("name") String name, String URL, @PathParam("publiclyVisible") boolean publiclyVisible) {
	//We need to get globalID from the current HTTP session instead of from PrincipalContext.
		Principal p = Principal.getPrincipal(session);
		if (p != null) {
			Integer userID = p.getLocalUser().getUserID();
			
			DataSource d = new DataSource();
			d.setName(name);
			d.setURL(URL);
			d.setPubliclyVisible(publiclyVisible);
			d.setUserID(userID);
			em.persist(d);
		} else {
			logger.warn("Principal is null! Datasource not persisted!");
		}
	}	
	
	//Get DataSources for the homepage
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)	
	public String getDataSources() {
		
		// Change to HTTPSession.getPrincipal
		Principal p = Principal.getPrincipal(session);
		if (p != null) {
			@SuppressWarnings("unchecked")
			Integer userID = p.getLocalUser().getUserID();
			List<DataSource> list = em.createNamedQuery(DataSource.QUERY_FIND_DataSources).setParameter("userID", userID).getResultList();
			
			StringBuilder retList = new StringBuilder("[");
			for (int i = 0; i < list.size(); i++) {
				if (i > 0) {
					retList.append(",");
				}
				JSONObject datasourceJSON = new JSONObject(list.get(i)); 
				String url = datasourceJSON.getString("URL"); // front end requires "url" instead of "URL"
				datasourceJSON.remove("URL");
				datasourceJSON.put("url",url);
				boolean edit = (datasourceJSON.getInt("userID") == userID);
				datasourceJSON.put("editable",edit);
				
				int dataSourceID = datasourceJSON.getInt("id");
				List<Chart> chartList = em.createNamedQuery(Chart.QUERY_FIND_ALL_BY_DS).setParameter("dataSourceID", dataSourceID).getResultList();
				if(chartList.size() > 0){
					datasourceJSON.put("used",true);
				} else {
					datasourceJSON.put("used",false);
				}
				
				retList.append(datasourceJSON.toString());
			}
			retList.append("]");
			return retList.toString();
		} else {
			logger.error("Error fetching datasources");
			return "[]";
		}
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
	@Path("/{id}/{editName}/{publiclyVisible}")
	@Consumes(MediaType.APPLICATION_JSON)	
	@Produces(MediaType.APPLICATION_JSON)	
	public void editDataSource(@PathParam("id") Integer id, @PathParam("editName") String editName, String url, @PathParam("publiclyVisible") boolean publiclyVisible) {
		//Find the DataSource in the database
		DataSource data = em.find(DataSource.class, id);
		data.setId(id);
		data.setName(editName);
		data.setURL(url);
		data.setPubliclyVisible(publiclyVisible);
		em.merge(data);
	}
	
}
