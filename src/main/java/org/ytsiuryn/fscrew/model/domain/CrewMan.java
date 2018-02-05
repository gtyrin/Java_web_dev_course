package org.ytsiuryn.fcrew.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Модуль описания структуры данных для сущности объекта члена экипажа.
 */

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

    @Column(name = "mid_name")
    private String midName;

    @Column(name = "last_name")
    private String lastName;

    private short age;

//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "spec_id")
//    private CrewSpec spec;
    @Column(name = "spec_id")
    private int spec;

    @Column(name = "flying_hours")
    private short flyingHours;

    @Column(name = "is_archive")
    private boolean isArchive;

    @Version
    @JsonIgnore
    private Long version;

    public int getId() {
        return id;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public short getAge() {
        return age;
    }

    public short getFlyingHours() {
        return flyingHours;
    }

    public boolean isArchive() {
        return isArchive;
    }
}
