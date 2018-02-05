package org.ytsiuryn.fcrew.web.service;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
//import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.Flight;

/**
 * Привязка обработчиков событий по созданию и изменению сущности "авиарейс".
 */

@Component
@RepositoryEventHandler(Flight.class)
public class FlightEventHandler {

    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    @Autowired
    public FlightEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }

    @HandleAfterCreate
    public void newFlight(Flight flight) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newFlight", getPath(flight));
        FCrewApplication.getLogger().info("Flight " + flight + " has added.");
    }

    // TODO для метода PATCH нет подходящей нотации.
    @HandleAfterSave
    public void updateFlight(Flight flight) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updateFlight", getPath(flight));
        FCrewApplication.getLogger().info("Flight " + flight + " has updated.");
    }

    @HandleAfterDelete
    public void deleteFlight(Flight flight) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/deleteFlight", getPath(flight));
        FCrewApplication.getLogger().info("Flight " + flight + " has deleted.");
    }

    /**
     * Take an {@link Flight} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param flight
     */
    private String getPath(Flight flight) {
        return this.entityLinks.linkForSingleResource(flight.getClass(),
                flight.getId()).toUri().getPath();
    }
}
