import { registerDecorator, ValidationOptions, ValidationArguments, isBase64 } from 'class-validator';

export function IsBase64DataURI(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBase64DataURI',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          const [header, base64] = value.split(',');
        //   console.log(header, base64)
          if (!header.startsWith('data:') || !header.includes(';base64')) {
            return false;
          }
          return isBase64(base64);
        },
      },
    });
  };
}