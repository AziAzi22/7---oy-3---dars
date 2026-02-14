import { IsEmail, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class VerifyAuthDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  otp: string;
}
