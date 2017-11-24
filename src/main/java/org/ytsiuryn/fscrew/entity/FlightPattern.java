package org.ytsiuryn.fscrew.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightPattern {

    @Id
    @GeneratedValue
    private int id;

    //    @Column(name = "plane_model_id")
    @ManyToOne
    private PlaneModel planeModel;

    //    @Column(name = "departure_airport_id")
    @ManyToOne
    private Airport departureAirport;

    @Column(name = "departure_time")
    private Date departureTime;

    //    @Column(name = "landing_airport_id")
    @ManyToOne
    private Airport landingAirport;

    @Column(name = "landing_time")
    private Date landingTime;
}
