package org.ytsiuryn.fcrew.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.Operator;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.MESSAGE_PREFIX;

/**
 * Привязка обработчиков событий по созданию и изменению сущности "пользователь системы".
 */

@Component
@RepositoryEventHandler(Operator.class)
public class OperatorEventHandler {

    private final SimpMessagingTemplate websocket;
    private final EntityLinks entityLinks;

    @Autowired
    public OperatorEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }

    @HandleAfterCreate
    public void newOperator(Operator operator) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newOperator", getPath(operator));
        FCrewApplication.getLogger().info("Operator " + operator + " has added.");
    }

    @HandleAfterSave
    public void updateOperator(Operator operator) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updateOperator", getPath(operator));
        FCrewApplication.getLogger().info("Operator " + operator + " has updated.");
    }

    @HandleAfterSave
    public void frozeOperator(Operator operator) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/frozeOperator", getPath(operator));
        String prefix = operator.isArchive() ? "" : "un";
        FCrewApplication.getLogger().info("Operator " + operator + " has " + prefix + "frozen.");
    }

    /**
     * Take an {@link Operator} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param operator
     */
    private String getPath(Operator operator) {
        return this.entityLinks.linkForSingleResource(operator.getClass(),
                operator.getUsername()).toUri().getPath();
    }

}