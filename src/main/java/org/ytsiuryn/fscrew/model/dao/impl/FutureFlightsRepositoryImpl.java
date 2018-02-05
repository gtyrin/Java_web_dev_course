package org.ytsiuryn.fcrew.model.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.ytsiuryn.fcrew.model.dao.FutureFlightsRepositoryCustom;
import org.ytsiuryn.fcrew.model.domain.Flight;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

/**
 * Класс предоставления данных предстоящих запросов. Данные предоставляются как есть, в "сыром" виде.
 */
@Repository
@Transactional(readOnly = true)
public class FutureFlightsRepositoryImpl implements FutureFlightsRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<Flight> getFutureFlights() {
        Query query = entityManager.createNativeQuery(
                "SELECT fl.id, FROM_UNIXTIME(fl.departure_time), a.name, fl.number "
                    + "FROM flight_screw.flight as fl, flight_screw.airport as a "
                    + "WHERE fl.landing_airport_id=a.id AND STR_TO_DATE(FROM_UNIXTIME(fl.departure_time), '%Y-%m-%d %H:%i:%s') >= CURDATE() "
                    + "AND fl.is_archive=0"
        );
        return query.getResultList();
    }
}
