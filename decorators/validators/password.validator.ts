import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class PasswordValidator implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return true;
  }

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return `비밀번호의 길이는 4~8자 여야합니다. 입력된 비밀번호 : ${value}`;
  }
}
