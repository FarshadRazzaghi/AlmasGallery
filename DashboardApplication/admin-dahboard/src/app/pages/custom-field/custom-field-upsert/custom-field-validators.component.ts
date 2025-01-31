import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Subscription } from "rxjs";

export const equalOrGreaterValidator = (controlToCompare: FormControl): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value || control.value.length === 0) {
      return null;
    }

    if (!controlToCompare) {
      return null;
    }

    const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
      control.updateValueAndValidity();
      subscription.unsubscribe();
    })

    return controlToCompare.value <= control.value ? { equalOrGreater: true } : null;
  };
}
