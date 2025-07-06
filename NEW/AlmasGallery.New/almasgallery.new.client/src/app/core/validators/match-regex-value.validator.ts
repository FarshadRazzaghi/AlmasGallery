import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const createBaseValidator = (control: AbstractControl, validateFn: () => boolean, errorKey: string): ValidationErrors | null => {
  if (!control?.value || control.value.length === 0) {
    return null;
  }

  return validateFn() ? { [errorKey]: true } : null;
}

export const MatchRegexValueValidator = (regex: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!regex) return null;

    return createBaseValidator(control, () => !new RegExp(regex).test(control.value), 'regex');
  };
}
