import {
  IsOptional,
  IsString,
  IsUUID,
  IsISO31661Alpha2,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
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
  app_key: string;

  @IsString()
  ip: string;

  @IsString()
  user_agent: string;

  @IsOptional()
  @IsISO31661Alpha2()
  iso2?: string;

  @IsOptional()
  @IsString()
  @IsValidTimezone({
    message:
      'Invalid timezone. Use a valid IANA time zone like "UTC" or "Asia/Karachi".',
  })
  timezone?: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsString()
  path: string;
}
