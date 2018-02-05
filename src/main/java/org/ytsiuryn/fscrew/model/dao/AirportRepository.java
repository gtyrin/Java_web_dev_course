package org.ytsiuryn.fcrew.model.dao;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import org.ytsiuryn.fcrew.model.domain.Airport;


@PreAuthorize("hasRole('ADMIN')")
public interface AirportRepository extends PagingAndSortingRepository<Airport, Integer> {

    Airport findByName(@Param("name") String name);

// адрес для поиска like '%he% (работает escaping для строк)
// http://localhost:8080/api/airports/search/findByNameLike?name=%25he%25
//    List<Airport> findByNameLike(@Param("name") String name);
//    List<Airport> findByCode(@Param("code") String opTypeId);
//    void update(Airport airport);
//    void updateById(int id);
}
