package org.perfmon4jreports.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
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

import org.perfmon4jreports.app.entity.Chart;

@Stateless
@Path("/charts")
public class ChartService {
	@PersistenceContext
	private EntityManager em;

	// Save or Update
	@PUT
	@Path("/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void saveOrUpdateChart(@PathParam("id") String id, String data) {	
		Chart chart = em.find(Chart.class, id);
		if(chart == null){
			chart = new Chart(id, data);
		} else {
			chart.setData(data);
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

	// Retrieve
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public String getCharts() {
		@SuppressWarnings("unchecked")
		List<Chart> list = em.createNamedQuery(Chart.QUERY_FIND_ALL).getResultList();
		StringBuilder retList = new StringBuilder("[");
		for (int i = 0; i < list.size(); i++) {
			if (i > 0) {
				retList.append(",");
			}
			retList.append(list.get(i).getData());
		}
		retList.append("]");
		return retList.toString();
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
