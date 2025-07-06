import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const createBaseValidator = (control: AbstractControl, validateFn: () => boolean, errorKey: string): ValidationErrors | null => {
  if (!control?.value || control.value.length === 0) {
    return null;
  }

  return validateFn() ? { [errorKey]: true } : null;
}

export const BetweenControllerValidator = (lowerValuePresenter: string, higherValuePresenter: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!lowerValuePresenter || !higherValuePresenter) return null;

    const lowerValueControlToCompare = control.parent?.get(lowerValuePresenter);
    const higherValueControlToCompare = control.parent?.get(higherValuePresenter);

    let isBetween = true;

    if (lowerValueControlToCompare) {
      isBetween = control.value >= lowerValueControlToCompare.value;
    }

    if (higherValueControlToCompare) {
      isBetween = isBetween && control.value <= higherValueControlToCompare.value;
    }

    return createBaseValidator(control, () => !isBetween, 'between');
  };
}
