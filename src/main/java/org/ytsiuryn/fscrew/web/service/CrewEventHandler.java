package org.ytsiuryn.fcrew.web.service;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.Airport;
import org.ytsiuryn.fcrew.model.domain.Crew;

/**
 * Привязка обработчиков событий по созданию, изменению и удалению сущности "экипаж".
 */

@Component
@RepositoryEventHandler(Crew.class)
public class CrewEventHandler {

    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    @Autowired
    public CrewEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }

    @HandleAfterCreate
    public void newCrew(Crew crew) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newCrew", getPath(crew));
        FCrewApplication.getLogger().info("Crew man " + crew + " has added.");
    }

    @HandleAfterSave
    public void updateCrew(Crew crew) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updateCrew", getPath(crew));
        FCrewApplication.getLogger().info("Crew man " + crew + " has updated.");
    }

    @HandleAfterDelete
    public void deleteCrew(Crew crew) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/deleteCrew", getPath(crew));
        FCrewApplication.getLogger().info("Crew man " + crew + " has deleted.");
    }

    /**
     * Take an {@link Crew} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param crew
     */
    private String getPath(Crew crew) {
        return this.entityLinks.linkForSingleResource(crew.getClass(),
                crew.getId()).toUri().getPath();
    }
}
