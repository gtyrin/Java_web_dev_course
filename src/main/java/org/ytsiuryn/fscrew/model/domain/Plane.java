package org.ytsiuryn.fcrew.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Модуль описания структуры данных для сущности объектов "самолет".
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plane {

    @Id
    @GeneratedValue
    private int id;

//    @ManyToOne
//    @JoinColumn(name = "model_id")
//    private PlaneModel model;
    @Column(name = "model_id")
    private int model;

    @Column(name = "boarding_number")
    private String boardingNumber;

    @Column(name = "is_archive")
    private boolean isArchive;

    @Version
    @JsonIgnore
    private Long version;

    public int getId() {
        return id;
    }

    public String getBoardingNumber() {
        return boardingNumber;
    }

    public int getModel() {
        return model;
    }

    public boolean isArchive() {
        return isArchive;
    }
}
