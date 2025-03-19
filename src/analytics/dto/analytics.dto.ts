import {
  IsOptional,
  IsString,
  IsUUID,
  registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface
} from 'class-validator';
import * as moment from 'moment-timezone';


@ValidatorConstraint({ async: false })
export class IsValidTimezoneConstraint implements ValidatorConstraintInterface {
  validate(timezone: string) {
    return timezone && moment.tz.names().includes(timezone);
  }

  defaultMessage() {
    return 'Invalid timezone. Use a valid IANA time zone (e.g., "UTC", "Asia/Karachi").';
  }
}

export function IsValidTimezone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTimezoneConstraint,
    });
  };
}


export class CreateVisitDto {
  @IsUUID(4)
  appKey: string;

  @IsUUID(4)
  sessionId: string;

  @IsString()
  @IsValidTimezone({ message: 'invalid timezone. Use a valid IANA time zone like "UTC" or "Asia/Karachi".' })
  timezone: string;

  @IsString()
  @IsOptional()
  page: string;
}
