import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const createBaseValidator = (control: AbstractControl, validateFn: () => boolean, errorKey: string): ValidationErrors | null => {
	if (!control?.value || control.value.length === 0) {
		return null;
	}

	return validateFn() ? { [errorKey]: true } : null;
}

export const equalOrGreaterControllerValidator = (presenter: string): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!presenter) return null;

		const controlToCompare = control.parent?.get(presenter);
		if (!controlToCompare) return null;

		return createBaseValidator(control, () => controlToCompare.value <= control.value, 'equalOrGreater');
	};
}

export const betweenControllerValidator = (lowerValuePresenter: string, higherValuePresenter: string): ValidatorFn => {
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

export const betweenValueValidator = (lowerValue?: number, higherValue?: number): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors | null => {
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