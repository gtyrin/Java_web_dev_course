package org.ytsiuryn.fcrew.web.service;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
//import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.Plane;

/**
 * Привязка обработчиков событий по созданию и изменению сущности "самолет".
 */

@Component
@RepositoryEventHandler(Plane.class)
public class PlaneEventHandler {

    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    @Autowired
    public PlaneEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }

    @HandleAfterCreate
    public void newPlane(Plane plane) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newPlane", getPath(plane));
        FCrewApplication.getLogger().info("Plane " + plane + " has added.");
    }

    @HandleAfterSave
    public void updatePlane(Plane plane) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updatePlane", getPath(plane));
        FCrewApplication.getLogger().info("Plane " + plane + " has updated.");
    }

    @HandleAfterSave
    public void frozePlane(Plane plane) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/frozePlane", getPath(plane));
        String prefix = plane.isArchive() ? "" : "un";
        FCrewApplication.getLogger().info("Plane " + plane + " has " + prefix + "frozen.");
    }

    /**
     * Take an {@link Plane} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param plane
     */
    private String getPath(Plane plane) {
        return this.entityLinks.linkForSingleResource(plane.getClass(),
                plane.getId()).toUri().getPath();
    }
}
