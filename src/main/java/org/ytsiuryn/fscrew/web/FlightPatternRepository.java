package org.ytsiuryn.fscrew.web;

import java.util.List;

import org.ytsiuryn.fscrew.entity.FlightPattern;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface FlightPatternRepository extends PagingAndSortingRepository<FlightPattern, Integer> {

    List<FlightPattern> findByPlaneModelId(@Param("plane-model-id") int planeModelId);
    List<FlightPattern> findByDepartureAirportId(@Param("departure-airport-id") int departureAirportId);
    List<FlightPattern> findByLandingAirportId(@Param("landing-airport-id") int landingAirportId);
}