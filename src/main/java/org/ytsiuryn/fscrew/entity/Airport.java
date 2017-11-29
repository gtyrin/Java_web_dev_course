package org.ytsiuryn.fscrew.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Airport {

    @Id
    @GeneratedValue
    private int id;

    private String name;

    private String code;

    private float latitude;

    private  float longitude;

    @Column(name = "is_archive")
    private boolean isArchive;
}
