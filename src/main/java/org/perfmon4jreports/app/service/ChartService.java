package org.perfmon4jreports.app.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;
import org.perfmon4jreports.app.Application;
import org.perfmon4jreports.app.entity.Chart;
import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.User;
//check login status
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
@Path("/charts")
public class ChartService {
	@PersistenceContext
	private EntityManager em;
	
	private static final  Logger logger = LoggerFactory.getLogger(ChartService.class);
	
	@Inject
	HttpSession session;
	
	// Save or Update
	@PUT
	@Path("/{id}/{dsID}/{publiclyVisible}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public void saveOrUpdateChart(@PathParam("id") String id, @PathParam("dsID") Integer dsID, @PathParam("publiclyVisible") boolean publiclyVisible, String data) {	
		//String data has chosendatasource id attached to it.  We need to parse out the chosen data source id and put it in it's own column.  
		//Then we can make sure that we can't delete a datasource that is attached to a chart
		String [] tokens = data.split(":",4);
		String dir1 = tokens[2];
		
		//PrincpalContext is being removed. We need to get globalID from HTTPSession
		Integer userID = Principal.getPrincipal(session).getLocalUser().getUserID();
		System.out.println("UserID while saving chart " + userID);
		
		Chart chart = em.find(Chart.class, id);
		if(chart == null){
			chart = new Chart(id, data, userID, dsID, publiclyVisible);
		} else {
			chart.setData(data);
			chart.setPubliclyVisible(publiclyVisible);
		}
		em.persist(chart);
	}
	
	
	// Retrieve
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getChart(@PathParam("id") String id) {
		Chart chart = em.find(Chart.class, id);
		if (chart == null) {
			// This is a not found situation
			throw new NotFoundException("Chart " + id + " not found.");
		}
		return chart.getData();
	}
	
	// Retrieve public
	@GET
	@Path("/public")
	@Produces(MediaType.APPLICATION_JSON)
	public String getPublicCharts() {
		@SuppressWarnings("unchecked")
		List<Chart> list = em.createNamedQuery(Chart.QUERY_FIND_ALL_PUBLIC).getResultList();
		StringBuilder retList = new StringBuilder("[");
		for (int i = 0; i < list.size(); i++) {
			if (i > 0) {
				retList.append(",");
			}
			JSONObject chartJSON = new JSONObject(list.get(i).getData()); 
			JSONObject datasourceJSON = (JSONObject)chartJSON.get("chosenDatasource");
			int userID = datasourceJSON.getInt("userID");
			
			List<User> results = em.createNamedQuery(User.QUERY_FIND_USER_BY_USERID).setParameter("userID", userID).getResultList();
			chartJSON.put("userFullName",results.get(0).getName());
			retList.append(chartJSON.toString());
		}
		retList.append("]");
		return retList.toString();
	}

	// Retrieve
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public String getCharts() {
		if (!Principal.isLoggedIn(session)){
			return "[]";
		}
		else {
			Integer userID = Principal.getPrincipal(session).getLocalUser().getUserID();
			
			@SuppressWarnings("unchecked")
			List<Chart> list = em.createNamedQuery(Chart.QUERY_FIND_ALL).setParameter("userID", userID).getResultList();
			StringBuilder retList = new StringBuilder("[");
			for (int i = 0; i < list.size(); i++) {
				if (i > 0) {
					retList.append(",");
				}
				JSONObject chartJSON = new JSONObject(list.get(i).getData()); // leaving this here in case we need to insert a field later
				retList.append(chartJSON.toString());
			}
			retList.append("]");
			return retList.toString();
		}
	}

	// Delete
	@DELETE
	@Path("/{id}")
	public boolean deleteChart(@PathParam("id") String id) {
		Chart chart = em.find(Chart.class, id);
		if (chart == null) {
			return false;
		}
		else {
			em.remove(chart);
		}
	return true;
		
	}
	
}
