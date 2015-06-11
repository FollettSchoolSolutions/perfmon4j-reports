package org.perfmon4j.reports.app.service;

import java.util.Arrays;
import java.util.List;

import javax.websocket.server.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.perfmon4j.reports.app.data.DataSourceVo;

@Path("/datasources")
public class DataSourceService {
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

	@PUT
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)	
	@Consumes(MediaType.APPLICATION_JSON)	
	public DataSourceVo updateDataSource(@PathParam("id") Long id, DataSourceVo data) {
		// TODO perform database ops here
		return data;
	}
	
}
