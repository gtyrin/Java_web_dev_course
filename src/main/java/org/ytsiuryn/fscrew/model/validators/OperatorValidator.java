package org.ytsiuryn.fcrew.model.validators;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.ytsiuryn.fcrew.model.domain.Operator;

/**
 * Валидатор для класса сущности "Пользователь системы".
 */
public class OperatorValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return Operator.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "username.required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "role", "role.required");

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "password.required");
    }

}
