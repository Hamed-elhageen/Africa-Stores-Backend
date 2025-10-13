import { ValidationError } from 'class-validator';

export function mapValidationErrors(errors: ValidationError[]): Record<string, string> {
    const result: Record<string, string> = {};

    function traverse(errs: ValidationError[], parent = '') {
        for (const e of errs) {
            const path = parent ? `${parent}.${e.property}` : e.property;

            if (e.constraints) {
                // Pick the first message (you could use all if you want)
                result[path] = Object.values(e.constraints)[0];
            }

            if (e.children && e.children.length) {
                traverse(e.children, path);
            }
        }
    }

    traverse(errors);
    return result;
}
