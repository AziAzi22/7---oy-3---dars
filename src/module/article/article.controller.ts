import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { CreateArticleSwaggerImageDto } from "./dto/create-swagger-image.dto";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/shared/constants/user-role.constants";

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@ApiTags("Article")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // CREATE

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiOperation({ description: "create article api (public)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateArticleSwaggerImageDto })
  @ApiCreatedResponse({ description: "article created" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueName = `${file.fieldname}${Math.random() * 1e9}`;
          const ext = path.extname(file.originalname);
          cb(null, uniqueName + ext);
        },
      }),
    }),
  )
  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.articleService.create(createArticleDto, file);
  }

  // GET ALL

  @ApiOperation({ description: "get all articles api (public)" })
  @ApiOkResponse({ description: "list of articles" })
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  // GET ONE

  @ApiOperation({ description: "get one article api (public)" })
  @ApiOkResponse({ description: "get one article" })
  @ApiNotFoundResponse({ description: "article not found" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(+id);
  }

  // UPDATE

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiOperation({ description: "update article api (owner)" })
  @ApiBody({ type: CreateArticleDto })
  @ApiOkResponse({ description: "article updated" })
  @ApiNotFoundResponse({ description: "article not found" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  // DELETE

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiOperation({ description: "delete article api (owner)" })
  @ApiOkResponse({ description: "article deleted" })
  @ApiNotFoundResponse({ description: "article not found" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleService.remove(+id);
  }
}
