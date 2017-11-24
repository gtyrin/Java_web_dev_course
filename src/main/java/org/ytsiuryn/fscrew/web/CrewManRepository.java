package org.ytsiuryn.fscrew.web;

import java.util.List;

import org.ytsiuryn.fscrew.entity.CrewMan;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface CrewManRepository extends PagingAndSortingRepository<CrewMan, Integer> {

    List<CrewMan> findByLastName(@Param("last-name") String lastName);
    List<CrewMan> findBySpecId(@Param("spec-id") int specId);
    List<CrewMan> findByIsPermitted(@Param("is-permitted") boolean isPermitted);

}