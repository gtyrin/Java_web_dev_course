package org.ytsiuryn.fcrew.model.validators;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.ytsiuryn.fcrew.model.domain.Airport;

/**
 * Валидатора для класса сущности "Аэропорт".
 */
public class AirportValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return Airport.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "name.required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "code", "code.required");
    }

}
