import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsSpecificUrlConstraint implements ValidatorConstraintInterface {
    validate(url: any, args: ValidationArguments) {
        const [expectedDomain] = args.constraints;
        if (typeof url !== 'string') {
            return false;
        }
        try {
            const { hostname } = new URL(url);
            return hostname === `www.${expectedDomain}.com` || hostname === `${expectedDomain}.com`;
        } catch {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const [expectedDomain] = args.constraints;
        return `The URL must be a valid ${expectedDomain}.com URL (e.g., https://www.${expectedDomain}.com/username).`;
    }
}

// Decorator function to use in your DTO
export function IsSpecificUrl(domain: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [domain],
            validator: IsSpecificUrlConstraint,
        });
    };
}