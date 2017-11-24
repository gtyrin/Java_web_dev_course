package org.ytsiuryn.fscrew.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "operator_type")
@Data
@NoArgsConstructor
//@AllArgsConstructor
public class OperatorType {

    @Id
//    @GeneratedValue
    private int id;

    private String name;

    public OperatorType(String name) {
        this.name = name;
    }
}
