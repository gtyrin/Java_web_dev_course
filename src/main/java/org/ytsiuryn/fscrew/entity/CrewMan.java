package org.ytsiuryn.fscrew.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity(name = "crew_man")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrewMan {

    @Id
    @GeneratedValue
    private int id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private byte age;

    @ManyToOne
    private CrewSpec spec;

    @Column(name = "flying_hours")
    private short flyingHours;

    @Column(name = "is_permitted")
    private boolean isPermitted;

    @Column(name = "is_archive")
    private boolean isArchive;
}
