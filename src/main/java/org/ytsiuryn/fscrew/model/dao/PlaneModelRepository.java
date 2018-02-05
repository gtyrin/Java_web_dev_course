package org.ytsiuryn.fcrew.model.dao;

import java.util.List;

import org.ytsiuryn.fcrew.model.domain.PlaneModel;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PlaneModelRepository extends PagingAndSortingRepository<PlaneModel, Integer> {

//    List<PlaneModel> findByName(@Param("name") String name);

}
