package org.perfmon4jreports.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.perfmon4jreports.app.data.ChartVo;
import org.perfmon4jreports.app.data.SeriesVo;
import org.perfmon4jreports.app.entity.Chart;
import org.perfmon4jreports.app.entity.Series;

@Stateless
@Path("/charts")
public class ChartService {
	@PersistenceContext
	private EntityManager em;

	// Create
	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public ChartVo saveChart(ChartVo chartVo) {
		Chart chartEntity = new Chart(chartVo);
		em.persist(chartEntity);
		
//		for (SeriesVo seriesVo : chartVo.getSeries()) {
//			Series seriesEntity = new Series(seriesVo);
//			em.persist(seriesVo);
//		}
		
		return chartEntity.toVo();
	}

	// Retrieve
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public ChartVo getChart(@PathParam("id") long id) {
		Chart chart = em.find(Chart.class, new Long(id));
		if (chart == null) {
			// This is a not found situation
			throw new NotFoundException("Chart " + id + " not found.");
		}
		return chart.toVo();
	}

	// Retrieve
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChartVo> getCharts() {
		List<Chart> list = em.createNamedQuery(Chart.QUERY_FIND_ALL).getResultList();
		List<ChartVo> retList = new ArrayList<>();
		for(Chart c : list){
			ChartVo cvo = c.toVo();
			retList.add(cvo);
		}
		return retList;
	}

	// Update

	// Delete
}
