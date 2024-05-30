import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    isBase64,
    isURL
} from 'class-validator';

export function IsEitherUrlOrBase64DataURI(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsEitherUrlOrBase64DataURI',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (Array.isArray(value)) {
                        return value.every(val => checkSingleValue(val)); // Check every element in the array
                    } else {
                        return checkSingleValue(value); // Check a single value
                    }
                },
            },
        });
    };
}

function checkSingleValue(value: any): boolean {
    // console.log(value)
    if (isURL(value)) {
        return true; // Validate as URL
    }
    if (typeof value === 'string') {
        const [header, base64] = value.split(',');
        if (header.startsWith('data:') && header.includes(';base64')) {
            return isBase64(base64); // Validate as Base64 Data URI
        }
    }
    return false; // Not valid if neither conditions are met
}