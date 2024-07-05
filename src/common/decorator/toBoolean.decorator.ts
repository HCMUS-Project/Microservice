import { Transform } from 'class-transformer';

export function ToBoolean() {
    return Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return value;
    });
}