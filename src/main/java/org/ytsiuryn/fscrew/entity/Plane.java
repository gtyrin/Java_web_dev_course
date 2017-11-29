package org.ytsiuryn.fscrew.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plane {

    @Id
    @GeneratedValue
    private int id;

    //    @Column(name = "model_id")
    @ManyToOne
    private PlaneModel model;

    @Column(name = "boarding_number")
    private String boardingNumber;

    private byte age;

    @Column(name = "is_permitted")
    private boolean isPermitted;

    @Column(name = "is_archive")
    private boolean isArchive;
}
