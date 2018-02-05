package org.ytsiuryn.fcrew.model.validators;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.ytsiuryn.fcrew.model.domain.Plane;

/**
 * Валидатор для класса сущности "Самолет".
 */
public class PlaneValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return Plane.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        Plane plane = (Plane) obj;
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "boardingNumber", "boardingNumber.required");

        if (plane.getModel() <= 0) {
            errors.rejectValue("model", "model.required");
        }
    }

}
