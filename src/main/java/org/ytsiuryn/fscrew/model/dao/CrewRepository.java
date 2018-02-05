package org.ytsiuryn.fcrew.model.dao;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.ytsiuryn.fcrew.model.domain.Crew;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

@Repository
public interface CrewRepository extends PagingAndSortingRepository<Crew, Integer> {
    List<Crew> findByFlight(@Param("flightId")int flightId);
}