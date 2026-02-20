import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(10, 500)
  @ApiProperty({ default: "CSS       1" })
  heading: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(20, 20000)
  @ApiProperty({ default: "CSS must is popular style sheets in the world" })
  body: string;
}
