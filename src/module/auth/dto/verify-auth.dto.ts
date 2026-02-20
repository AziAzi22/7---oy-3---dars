import { IsEmail, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyAuthDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  @ApiProperty({ default: "aziazi22t@gmail.com" })
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @ApiProperty({ default: "4087921" })
  otp: string;
}
 