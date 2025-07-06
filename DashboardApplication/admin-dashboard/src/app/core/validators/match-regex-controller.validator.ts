import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const createBaseValidator = (control: AbstractControl, validateFn: () => boolean, errorKey: string): ValidationErrors | null => {
  if (!control?.value || control.value.length === 0) {
    return null;
  }

  return validateFn() ? { [errorKey]: true } : null;
}

export const MatchRegexControllerValidator = (presenter: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!presenter) return null;

    const controlToCompare = control.parent?.get(presenter);
    if (!controlToCompare || !controlToCompare.value) return null;

    return createBaseValidator(control, () => !new RegExp(controlToCompare.value).test(control.value), 'regex');
  };
}
