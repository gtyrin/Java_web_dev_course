package org.ytsiuryn.fcrew;

import org.junit.*;
import org.junit.runner.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.*;
import org.springframework.test.context.junit4.SpringRunner;
import org.ytsiuryn.fcrew.model.dao.AirportRepository;
import org.ytsiuryn.fcrew.model.domain.Airport;

import static org.assertj.core.api.Assertions.*;

/**
 * Тестирование взаимодействия с репозиторием сущности "аэропорт" по созданию объекта и проверки его свойств.
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class AirportRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AirportRepository repository;

    @Test
    public void testExample() throws Exception {
        this.entityManager.persist(new Airport("TEST10", "TST10"));
        Airport airport = this.repository.findByName("TEST10");
        assertThat(airport.getName()).isEqualTo("TEST10");
    }

}