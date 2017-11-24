package org.ytsiuryn.fscrew.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "plane_model")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaneModel {

    @Id
    @GeneratedValue
    private int id;

    private String name;

    private byte pilots;

    private byte navigators;

    @Column(name = "board_conductors")
    private byte boardConductors;

    @Column(name = "radio_operators")
    private byte radioOperators;

    private short passengers;

    @Column(name = "max_distance")
    private int maxDistance;
}
