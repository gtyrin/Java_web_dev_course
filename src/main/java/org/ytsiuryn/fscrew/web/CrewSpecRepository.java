package org.ytsiuryn.fscrew.web;

import java.util.List;

import org.ytsiuryn.fscrew.entity.CrewSpec;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface CrewSpecRepository extends PagingAndSortingRepository<CrewSpec, Integer> {

    List<CrewSpec> findByName(@Param("name") String name);

}