package org.ytsiuryn.fcrew.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
//import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

import org.ytsiuryn.fcrew.model.domain.*;


/**
Представление ID для сущностей в JSON.
 **/

@Configuration
public class MyReposytoryConfiguration  extends RepositoryRestConfigurerAdapter {

        @Override
        public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
            config.exposeIdsFor(Airport.class);
            config.exposeIdsFor(Plane.class);
            config.exposeIdsFor(PlaneModel.class);
            config.exposeIdsFor(CrewSpec.class);
            config.exposeIdsFor(CrewMan.class);
            config.exposeIdsFor(Flight.class);
        }
}
