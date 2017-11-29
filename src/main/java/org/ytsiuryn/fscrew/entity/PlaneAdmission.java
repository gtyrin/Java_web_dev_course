package org.ytsiuryn.fscrew.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Entity(name = "plane_admission")
@Data
public class PlaneAdmission {

    @Id
    @GeneratedValue
    private int id;

    private Date date;

    @ManyToOne
    private Plane plane;

    @Column(name = "is_admitted")
    private boolean isAdmitted;
}
