package org.ytsiuryn.fcrew.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Модуль описания структуры данных для сущности объектов рейсов.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue
    private int id;

    private String number;

//    @ManyToOne
//    private Plane plane;
    @Column(name = "plane_id")
    private int plane;

    //    @Column(name = "departure_airport_id")
//    @ManyToOne
//    private Airport departureAirport;
    @Column(name = "departure_airport_id")
    private int departureAirport;

    @Column(name = "departure_time")
    private int departureTime;

//    @ManyToOne
//    private Airport landingAirport;
    @Column(name = "landing_airport_id")
    private int landingAirport;

    @Column(name = "landing_time")
    private int landingTime;

    @Version
    @JsonIgnore
    private Long version;

    public int getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

}
