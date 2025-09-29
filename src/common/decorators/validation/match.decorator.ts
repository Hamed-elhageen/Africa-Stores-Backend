import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function Match(property: string, validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: "match",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, arg: ValidationArguments) {
                    const [relatedPropertyName] = arg.constraints;
                    const relatedValue = (arg.object as any)[relatedPropertyName];
                    return value === relatedValue
                },
                defaultMessage(arg: ValidationArguments) {
                    const [relatedPropertyName] = arg.constraints;
                    return `${arg.property} must match ${relatedPropertyName}`
                }
            }

        })
    }
}