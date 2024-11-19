import { registerDecorator, ValidationOptions } from 'class-validator';
import { PasswordValidator } from './validator/password.validator';

// Custom Decorator
function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: PasswordValidator,
    });
  };
}
