package org.ytsiuryn.fcrew.model.dao;

import java.util.List;

import org.ytsiuryn.fcrew.model.domain.CrewSpec;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface CrewSpecRepository extends PagingAndSortingRepository<CrewSpec, Integer> {

//    List<CrewSpec> findByNameLike(@Param("name") String name);

}