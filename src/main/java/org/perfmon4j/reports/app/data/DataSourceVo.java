package org.perfmon4j.reports.app.data;

public class DataSourceVo {
    private String name;
    private String host;
    
    // -----------------------------------------------------------------------------------------------------------------------
    public DataSourceVo(String name, String host) {
        this.name = name;
        this.host = host;
    }

    // -----------------------------------------------------------------------------------------------------------------------
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    
    // -----------------------------------------------------------------------------------------------------------------------
    public String getHost() {
        return host;
    }
    public void setHost(String host) {
        this.host = host;
    }
}
