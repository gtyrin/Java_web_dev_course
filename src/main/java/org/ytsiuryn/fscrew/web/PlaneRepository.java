package org.ytsiuryn.fscrew.web;

import java.util.List;

import org.ytsiuryn.fscrew.entity.Plane;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PlaneRepository extends PagingAndSortingRepository<Plane, Integer> {

    List<Plane> findByModelId(@Param("model-id") int modelId);
    List<Plane> findByBoardingNumber(@Param("boarding-number") String boardingNumber);

}