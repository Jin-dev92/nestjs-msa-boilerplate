import { registerDecorator, ValidationOptions } from 'class-validator';
import { PasswordValidator } from './validators';

// Custom Decorator
function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: PasswordValidator,
    });
  };
}
