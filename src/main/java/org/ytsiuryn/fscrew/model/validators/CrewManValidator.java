package org.ytsiuryn.fcrew.model.validators;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.ytsiuryn.fcrew.model.domain.CrewMan;

/**
 * Валидатор для класса сущности "Член экипажа".
 */
public class CrewManValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return CrewMan.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        CrewMan crewMan = (CrewMan) obj;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "lastName", "lastName.required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "firstName", "firstName.required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "spec", "spec.required");

        if (crewMan.getAge() < 24) {
            errors.rejectValue("age", "age.must_be_older");
        }

        if (crewMan.getAge() >= 55) {
            errors.rejectValue("age", "age.must_be_younger");
        }

        if (crewMan.getFlyingHours() < 100) {
            errors.rejectValue("flyingHours", "flyingHours.must_be_greater");
        }
    }

}
