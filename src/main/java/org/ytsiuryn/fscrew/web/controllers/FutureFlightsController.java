package org.ytsiuryn.fcrew.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ytsiuryn.fcrew.model.domain.Flight;
import org.ytsiuryn.fcrew.model.dao.FutureFlightsRepository;

import java.util.List;

/**
 * Обработка URI для запроса предстоящих полетов.
 */
@RestController
public class FutureFlightsController {
    @Autowired
    private FutureFlightsRepository futureFlightsRepository;

    @RequestMapping("/api/futureFlights")
    public List<Flight> getFiltered() {
        return futureFlightsRepository.getFutureFlights();
    }
}
