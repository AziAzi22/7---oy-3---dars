import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ArticleImagesService } from "./article-images.service";
import { UpdateArticleImageDto } from "./dto/update-article-image.dto";
import { AuthGuard } from "src/common/guard/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/shared/constants/user-role.constants";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { ArticleSwaggerImagesDto } from "./dto/create-swagger-article-images.dto";
import { CreateArticleImageDto } from "./dto/create-article-image.dto";

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@UseGuards(AuthGuard)
@Controller("article-images")
export class ArticleImagesController {
  constructor(private readonly articleImagesService: ArticleImagesService) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @ApiOperation({ description: "Create article image" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: ArticleSwaggerImagesDto,
  })
  @ApiCreatedResponse({ description: "article image created" })
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueName = ` ${file.fieldname}${Math.random() * 1e9}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  @Post()
  create(
    @Body() createArticleImageDto: CreateArticleImageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.articleImagesService.create(createArticleImageDto, files);
  }

  @Get()
  findAll() {
    return this.articleImagesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleImagesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateArticleImageDto: UpdateArticleImageDto,
  ) {
    return this.articleImagesService.update(+id, updateArticleImageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleImagesService.remove(+id);
  }
}
