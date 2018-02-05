package org.ytsiuryn.fcrew.model.validators;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.ytsiuryn.fcrew.model.domain.PlaneModel;

public class PlaneModelValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return PlaneModel.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        PlaneModel planeModel = (PlaneModel) obj;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "name.required");

        if (planeModel.getPilots() <= 0) {
            errors.rejectValue("pilots", "pilots.must_be_greater");
        }

        if (planeModel.getPassengers() <= 0) {
            errors.rejectValue("passengers", "passengers.must_be_greater");
        }

        if (planeModel.getNavigators() <= 0) {
            errors.rejectValue("navigators", "navigators.must_be_greater");
        }

        if (planeModel.getBoardConductors() <= 0) {
            errors.rejectValue("boardConductors", "boardConductors.must_be_greater");
        }

        if (planeModel.getRadioOperators() <= 0) {
            errors.rejectValue("radioOperators", "radioOperators.must_be_greater");
        }
    }

}
