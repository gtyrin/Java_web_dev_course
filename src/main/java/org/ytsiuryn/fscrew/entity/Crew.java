package org.ytsiuryn.fscrew.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Crew {

    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    private Flight flight;

    @ManyToOne
    private CrewMan crewMan;

    @Column(name = "is_commander")
    private boolean isCommander;

}