import { IsEmail, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
  @IsString({ message: "username string bo'lishi kerak" })
  @Transform(({ value }) => value.trim())
  @Length(3, 50)
  @ApiProperty({ default: "fta22" })
  username: string;

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
