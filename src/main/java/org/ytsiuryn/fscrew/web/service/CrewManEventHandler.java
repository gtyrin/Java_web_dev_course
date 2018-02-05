package org.ytsiuryn.fcrew.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.CrewMan;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.MESSAGE_PREFIX;

/**
 * Привязка обработчиков событий по созданию и изменению сущности "член экипажа".
 */

@Component
@RepositoryEventHandler(CrewMan.class)
public class CrewManEventHandler {

    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    @Autowired
    public CrewManEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }

    @HandleAfterCreate
    public void newCrewMan(CrewMan crewMan) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newCrewman", getPath(crewMan));
        FCrewApplication.getLogger().info("Crew Man " + crewMan + " has added.");
    }

    @HandleAfterSave
    public void updateCrewMan(CrewMan crewMan) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updateCrewman", getPath(crewMan));
        FCrewApplication.getLogger().info("Crew Man " + crewMan + " has updated.");
    }

    @HandleAfterSave
    public void frozeCrewMan(CrewMan crewMan) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/frozeCrewman", getPath(crewMan));
        String prefix = crewMan.isArchive() ? "" : "un";
        FCrewApplication.getLogger().info("Crew Man " + crewMan + " has " + prefix + "frozen.");
    }

    /**
     * Take an {@link CrewMan} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param crewMan
     */
    private String getPath(CrewMan crewMan) {
        return this.entityLinks.linkForSingleResource(crewMan.getClass(),
                crewMan.getId()).toUri().getPath();
    }
}

