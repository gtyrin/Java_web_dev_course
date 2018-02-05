package org.ytsiuryn.fcrew.model.validators;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.ytsiuryn.fcrew.model.domain.CrewSpec;

/**
 * Валидатор для класса сущности "специальность члена экипажа".
 */

public class CrewSpecValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return CrewSpec.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "name.required");
    }

}
