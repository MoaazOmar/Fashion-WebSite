import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // If there's no value, don't return an error - let Validators.required handle empty fields
    if (!value) return null;

    const errors: ValidationErrors = {};
    const requirements = {
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    };

    // Check which requirements are not met
    const missingRequirements = [];
    if (!requirements.hasUpperCase) missingRequirements.push('uppercase letter');
    if (!requirements.hasLowerCase) missingRequirements.push('lowercase letter');
    if (!requirements.hasNumber) missingRequirements.push('number');
    if (!requirements.hasSpecialCharacter) missingRequirements.push('special character');

    // Only return errors if there are missing requirements
    if (missingRequirements.length > 0) {
      errors['strongPassword'] = {
        message: 'Password must contain:',
        requirements: missingRequirements
      };
    }

    return Object.keys(errors).length ? errors : null;
  };
}
// using the group for multiply group validation
// we specify group.get('password')('confirmPassword') as that's group validation we need value for each of them
export function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
}
// using the control for single validation input
// we specify control as it's single validation for control
export function noBadWordsDuringCreationUsername(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const username = control.value?.toLowerCase();
    const badWords = ['bad', 'hate', 'evil', 'witch'];
    const containsBadWord = badWords.some(badWord => username?.includes(badWord));
    return containsBadWord ? { badWordsIncluded: true } : null;
  };
} 