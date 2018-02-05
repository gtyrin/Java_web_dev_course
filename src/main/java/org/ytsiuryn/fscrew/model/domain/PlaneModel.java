package org.ytsiuryn.fcrew.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Модуль описания структуры данных для сущности объекта "тип самолета".
 */

@Entity(name = "plane_model")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaneModel {

    @Id
    @GeneratedValue
    private int id;

    private String name;

    private short pilots;

    private short navigators;

    @Column(name = "board_conductors")
    private short boardConductors;

    @Column(name = "radio_operators")
    private short radioOperators;

    private short passengers;

    @Column(name = "is_archive")
    private boolean isArchive;

    @Version
    @JsonIgnore
    private Long version;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public short getPilots() {
        return pilots;
    }

    public short getNavigators() {
        return navigators;
    }

    public short getBoardConductors() {
        return boardConductors;
    }

    public short getRadioOperators() {
        return radioOperators;
    }

    public short getPassengers() {
        return passengers;
    }

    public boolean isArchive() {
        return isArchive;
    }
}
