package org.ytsiuryn.fscrew.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "crew_spec")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrewSpec {

    @Id
    @GeneratedValue
    private int id;

    private String name;

    @Column(name = "is_archive")
    private boolean isArchive;
}
