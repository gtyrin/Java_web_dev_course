package org.ytsiuryn.fcrew.model.dao;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.ytsiuryn.fcrew.model.domain.Operator;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface OperatorRepository extends PagingAndSortingRepository<Operator, Integer> {

//    Operator save(Operator operator);

}