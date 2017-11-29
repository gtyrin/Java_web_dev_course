package org.ytsiuryn.fscrew.web;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.ytsiuryn.fscrew.entity.Airport;

import java.util.List;

// tag::code[]
public interface AirportRepository extends PagingAndSortingRepository<Airport, Integer> {
    List<Airport> findByName(@Param("name") String name);
    List<Airport> findByNameLike(@Param("name") String name); // TODO разобраться почему не работает
    List<Airport> findByCode(@Param("code") String opTypeId);
}
// end::code[]
