package org.ytsiuryn.fcrew.web.service;

import static org.ytsiuryn.fcrew.web.service.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import org.ytsiuryn.fcrew.FCrewApplication;
import org.ytsiuryn.fcrew.model.domain.Airport;

/**
 * Привязка обработчиков событий по созданию и изменению сущности "аэропорт".
 */
@Component
@RepositoryEventHandler(Airport.class)
public class AirportEventHandler {

	private final SimpMessagingTemplate websocket;

	private final EntityLinks entityLinks;

	@Autowired
	public AirportEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newAirport(Airport airport) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newAirport", getPath(airport));
		FCrewApplication.getLogger().info("Airport " + airport + " has added.");
	}

	@HandleAfterSave
	public void updateAirport(Airport airport) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateAirport", getPath(airport));
		FCrewApplication.getLogger().info("Airport " + airport + " has updated.");
	}

	@HandleAfterSave
	public void frozeAirport(Airport airport) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/frozeAirport", getPath(airport));
		String prefix = airport.isArchive() ? "" : "un";
		FCrewApplication.getLogger().info("Airport " + airport + " has " + prefix + "frozen.");
	}

	/**
	 * Take an {@link Airport} and get the URI using Spring Data REST's {@link EntityLinks}.
	 *
	 * @param airport
	 */
	private String getPath(Airport airport) {
		return this.entityLinks.linkForSingleResource(airport.getClass(),
				airport.getId()).toUri().getPath();
	}
}
