package org.perfmon4jreports.app;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ws.rs.ApplicationPath;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
@Startup
@ApplicationPath("/rest")
public class Application extends javax.ws.rs.core.Application {
    private static final  Logger logger = LoggerFactory.getLogger(Application.class);
    
    // -----------------------------------------------------------------------------------------------------------------------
    @PostConstruct
    public void startup() {
        logger.info("Starting perfom4j reporting services");
    }
    
    @PreDestroy
    public void shutdown() {
        logger.info("Stopping perfom4j reporting services");        
    }
}
