import { IsEmail, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class CreateAuthDto {
  @IsString({ message: "username string bo'lishi kerak" })
  @Transform(({ value }) => value.trim())
  @Length(3, 50)
  username: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;
}
