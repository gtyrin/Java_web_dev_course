package org.ytsiuryn.fcrew.model.dao;

import org.ytsiuryn.fcrew.model.domain.Flight;

import java.util.List;

public interface FutureFlightsRepositoryCustom {
    List<Flight> getFutureFlights();
}
