import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
class DomainOrTenantIdConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const object = args.object as any;
        return !!(object.domain || object.tenantId); // Ensure at least one is present
    }

    defaultMessage(args: ValidationArguments) {
        return 'Either domain or tenantId must be provided';
    }
}

export function DomainOrTenantId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: DomainOrTenantIdConstraint,
        });
    };
}