package org.ytsiuryn.fcrew.model.dao;

import java.util.List;

import org.ytsiuryn.fcrew.model.domain.CrewMan;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface CrewManRepository extends PagingAndSortingRepository<CrewMan, Integer> {
//    List<CrewMan> findByLastName(@Param("last-name") String lastName);
}