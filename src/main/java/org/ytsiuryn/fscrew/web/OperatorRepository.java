package org.ytsiuryn.fscrew.web;

import java.util.List;

import org.ytsiuryn.fscrew.entity.Operator;
import org.ytsiuryn.fscrew.entity.OperatorType;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface OperatorRepository extends PagingAndSortingRepository<Operator, Integer> {

    List<Operator> findByLogin(@Param("login") String login);
    List<Operator> findByOpType(@Param("op-type") OperatorType opType);

}