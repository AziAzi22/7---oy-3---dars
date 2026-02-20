import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginAuthDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  @ApiProperty({ default: "aziazi22t@gmail.com" })
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @ApiProperty({ default: "123456" })
  password: string;
}
