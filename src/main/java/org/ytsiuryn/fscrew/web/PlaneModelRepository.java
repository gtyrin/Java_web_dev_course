package org.ytsiuryn.fscrew.web;

import java.util.List;

import org.ytsiuryn.fscrew.entity.PlaneModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PlaneModelRepository extends PagingAndSortingRepository<PlaneModel, Integer> {

    List<PlaneModel> findByName(@Param("name") String name);

    // tag::code[]
    @Component
    class DatabaseLoader implements CommandLineRunner {

        private final OperatorTypeRepository repository;

        @Autowired
        public DatabaseLoader(OperatorTypeRepository repository) {
            this.repository = repository;
        }

        @Override
        public void run(String... strings) throws Exception {
//            this.repository.save(new OperatorType("Test"));
        }
    }
}
