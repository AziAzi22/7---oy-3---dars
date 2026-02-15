import { Transform } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(20, 500)
  heading: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(20, 20000)
  body: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(20, 500)
  backgroundImage: string;
}
