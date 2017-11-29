package org.ytsiuryn.fscrew.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Entity(name = "crew_man_admission")
@Data
public class CrewManAdmission {

    @Id
    @GeneratedValue
    private int id;

    private Date date;

    @ManyToOne
    private CrewMan crewMan;

    @Column(name = "is_admitted")
    private boolean isAdmitted;
}
