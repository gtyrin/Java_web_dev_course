package org.ytsiuryn.fcrew.model.domain;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Модуль описания структуры данных для сущности объектов аэропорта.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Airport {

    public Airport(String name, String code) {
        this.name = name;
        this.code = code;
    }

    @Id
    @GeneratedValue
    private int id;

    private String name;

    private String code;

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

    public String getCode() {
        return code;
    }

    public boolean isArchive() {
        return isArchive;
    }
}
