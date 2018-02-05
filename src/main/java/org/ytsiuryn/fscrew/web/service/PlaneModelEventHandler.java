package org.ytsiuryn.fcrew.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.PlaneModel;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.MESSAGE_PREFIX;

/**
 * Привязка обработчиков событий по созданию и изменению сущности "модель самолета".
 */

@Component
@RepositoryEventHandler(PlaneModel.class)
public class PlaneModelEventHandler {

    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    @Autowired
    public PlaneModelEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }

    @HandleAfterCreate
    public void newPlaneModel(PlaneModel planeModel) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newPlaneModel", getPath(planeModel));
        FCrewApplication.getLogger().info("Plane model " + planeModel + " has added.");
    }

    @HandleAfterSave
    public void updatePlaneModel(PlaneModel planeModel) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updatePlaneModel", getPath(planeModel));
        FCrewApplication.getLogger().info("Plane model " + planeModel + " has updated.");
    }

    @HandleAfterSave
    public void frozePlaneModel(PlaneModel planeModel) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/frozePlaneModel", getPath(planeModel));
        String prefix = planeModel.isArchive() ? "" : "un";
        FCrewApplication.getLogger().info("Plane model " + planeModel + " has " + prefix + "frozen.");
    }

    /**
     * Take an {@link PlaneModel} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param planeModel
     */
    private String getPath(PlaneModel planeModel) {
        return this.entityLinks.linkForSingleResource(planeModel.getClass(),
                planeModel.getId()).toUri().getPath();
    }

}
