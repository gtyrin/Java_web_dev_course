package org.ytsiuryn.fcrew.model.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.ytsiuryn.fcrew.model.domain.Flight;

/**
 * Определение репозитория для формирования данных предстоящих полетов.
 * Используется в форме ввода экипажа для формирования дерева полетов.
 */
@Repository
public interface FutureFlightsRepository extends CrudRepository<Flight, Integer>, FutureFlightsRepositoryCustom {
}
