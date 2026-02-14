import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginAuthDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;
}
