import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function RegexValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    try {
      new RegExp(value);
      return null;
    } catch (error) {
      return { invalidRegex: true };
    }
  };
}
