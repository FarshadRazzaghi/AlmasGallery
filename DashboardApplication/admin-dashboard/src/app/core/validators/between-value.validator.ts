import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const createBaseValidator = (control: AbstractControl, validateFn: () => boolean, errorKey: string): ValidationErrors | null => {
  if (!control?.value || control.value.length === 0) {
    return null;
  }

  return validateFn() ? { [errorKey]: true } : null;
}

export const BetweenValueValidator = (lowerValue?: number, higherValue?: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!lowerValue || !higherValue) return null;

    let isBetween = true;

    if (lowerValue) {
      isBetween = control.value >= lowerValue;
    }

    if (higherValue) {
      isBetween = isBetween && control.value <= higherValue;
    }

    return createBaseValidator(control, () => !isBetween, 'between');
  };
}
