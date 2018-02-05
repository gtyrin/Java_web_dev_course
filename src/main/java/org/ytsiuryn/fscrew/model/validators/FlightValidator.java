package org.ytsiuryn.fcrew.model.validators;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.ytsiuryn.fcrew.model.domain.Flight;

/**
 * Валидатор для класса сущности "Авива-рейс".
 */
public class FlightValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return Flight.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "number", "number.required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "departureAirport", "departureAirport.required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "departureTime", "departureTime.required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "landingAirport", "landingAirport.required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "landingTime", "landingTime.required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "plane", "plane.required");
        // TODO проверка времени приземления, большего, чем времени взлета
    }

}
