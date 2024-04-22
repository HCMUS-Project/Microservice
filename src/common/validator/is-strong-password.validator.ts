import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const { minLength, minLowercase, minNumbers, minSymbols, minUppercase } = args.constraints[0];
    const lowercaseRegex = /[a-z]/g;
    const uppercaseRegex = /[A-Z]/g;
    const numbersRegex = /[0-9]/g;
    const symbolsRegex = /[^A-Za-z0-9]/g;

    const lowercaseCount = (password.match(lowercaseRegex) || []).length;
    const uppercaseCount = (password.match(uppercaseRegex) || []).length;
    const numbersCount = (password.match(numbersRegex) || []).length;
    const symbolsCount = (password.match(symbolsRegex) || []).length;

    const missingRequirements: string[] = [];
    if (password.length < minLength) {
      missingRequirements.push(`at least ${minLength} characters`);
    }
    if (lowercaseCount < minLowercase) {
      missingRequirements.push(`${minLowercase} lowercase letters`);
    }
    if (uppercaseCount < minUppercase) {
      missingRequirements.push(`${minUppercase} uppercase letters`);
    }
    if (numbersCount < minNumbers) {
      missingRequirements.push(`${minNumbers} numbers`);
    }
    if (symbolsCount < minSymbols) {
      missingRequirements.push(`${minSymbols} symbols`);
    }

    if (missingRequirements.length > 0) {
      args.constraints[0].missingRequirements = missingRequirements;
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const missingRequirements = args.constraints[0].missingRequirements;
    return `Password must have ${missingRequirements.join(', ')}.`;
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }],
      validator: IsStrongPasswordValidator,
    });
  };
}