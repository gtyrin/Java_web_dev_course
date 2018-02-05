package org.ytsiuryn.fcrew.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;

/**
 * Модуль описания структуры данных для сущности объектов пользоваталей системы.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "password")
@Table(name = "user_roles")
public class Operator {

//    public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();


    @Id
    @GeneratedValue
    private int id;

    @Column
    private String username;

    @JsonIgnore
    @Column
    private String password;

    @Column
    private String role;

    @Column(name = "is_archive")
    private boolean isArchive;

    @Version
    @JsonIgnore
    private Long version;

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getPassword() {
        return password;
    }

    public boolean isArchive() {
        return isArchive;
    }
}
