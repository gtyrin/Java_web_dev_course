package org.ytsiuryn.fcrew.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Модуль описания структуры данных для сущности объектов экипажа рейса самолета.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Crew {

    @Id
    @GeneratedValue
    private int id;

//    @ManyToOne
    @Column(name = "flight_id")
    private int flight;

//    @ManyToOne
    @Column(name = "crew_man_id")
    private int crewMan;

    @Column(name = "is_commander")
    private boolean isCommander;

    @Version
    @JsonIgnore
    private Long version;

    public int getId() {
        return id;
    }
}