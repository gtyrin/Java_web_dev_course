package org.ytsiuryn.fcrew.model.dao;

import org.ytsiuryn.fcrew.model.domain.Flight;
import org.springframework.data.repository.PagingAndSortingRepository;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface FlightRepository extends PagingAndSortingRepository<Flight, Integer> {

//    List<Flight> findAllOrderByDepartureTimeDesc();

//    List<Flight> findByNumber(@Param("number") String login);
//
//    List<Flight> findByPlaneId(@Param("plane-id") int planeId);
//
//    List<Flight> findByDepartureAirportId(@Param("departure-airport-id") int departureAirportId);
//
//    List<Flight> findByLandingAirportId(@Param("landing-airport-id") int landingAirportId);
}