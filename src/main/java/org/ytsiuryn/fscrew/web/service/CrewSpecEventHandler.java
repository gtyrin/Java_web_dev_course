package org.ytsiuryn.fcrew.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.CrewSpec;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.MESSAGE_PREFIX;

/**
 * Привязка обработчиков событий по созданию и изменению сущности "специальность члена экипажа".
 */

@Component
@RepositoryEventHandler(CrewSpec.class)
public class CrewSpecEventHandler {

    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    @Autowired
    public CrewSpecEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }

    @HandleAfterCreate
    public void newCrewSpec(CrewSpec crewSpec) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newCrewSpec", getPath(crewSpec));
        FCrewApplication.getLogger().info("Position " + crewSpec + " has added.");
    }

    @HandleAfterSave
    public void updateCrewSpec(CrewSpec crewSpec) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updateCrewSpec", getPath(crewSpec));
        FCrewApplication.getLogger().info("Position " + crewSpec + " has updated.");
    }

    @HandleAfterSave
    public void frozeCrewSpec(CrewSpec crewSpec) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/frozeCrewSpec", getPath(crewSpec));
        String prefix = crewSpec.isArchive() ? "" : "un";
        FCrewApplication.getLogger().info("Position " + crewSpec + " has " + prefix + "frozen.");
    }

    /**
     * Take an {@link CrewSpec} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param crewSpec
     */
    private String getPath(CrewSpec crewSpec) {
        return this.entityLinks.linkForSingleResource(crewSpec.getClass(),
                crewSpec.getId()).toUri().getPath();
    }

}
