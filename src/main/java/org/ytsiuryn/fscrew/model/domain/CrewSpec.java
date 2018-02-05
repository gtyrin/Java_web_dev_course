package org.ytsiuryn.fcrew.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Модуль описания структуры данных для сущности объекта специальности члена экипажа.
 */

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

    @Version
    @JsonIgnore
    private Long version;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isArchive() {
        return isArchive;
    }
}
