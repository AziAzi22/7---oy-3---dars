import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateArticleImageDto } from "./dto/create-article-image.dto";
import { UpdateArticleImageDto } from "./dto/update-article-image.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleImage } from "./entities/article-image.entity";
import { Repository } from "typeorm";
import { Article } from "../article/entities/article.entity";

@Injectable()
export class ArticleImagesService {
  private readonly max_images: number = 10;

  constructor(
    @InjectRepository(ArticleImage)
    private articleImageRepository: Repository<ArticleImage>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(
    createArticleImageDto: CreateArticleImageDto,
    files: Express.Multer.File[],
  ): Promise<ArticleImage[]> {
    const foundedArticle = await this.articleRepository.find({
      where: { id: createArticleImageDto.articleId },
    });

    if (!foundedArticle) throw new NotFoundException("article not found");

    let foundedImages = await this.articleImageRepository.find({
      where: { article: { id: createArticleImageDto.articleId } },
    });

    if (foundedImages.length + files.length > this.max_images) {
      throw new BadRequestException(
        `You can't upload more than ${this.max_images} images per article, you have uploaded ${foundedImages.length} images already`,
      );
    }

    let sortOrder: number = foundedImages.length + 1;
    let result: ArticleImage[] = [];

    for (const file of files) {
      const createdImage = await this.articleImageRepository.create({
        url: `http://localhost:4001/uploads/${file.filename}`,
        sortOrder,
        article: { id: createArticleImageDto.articleId },
      });

      result.push(await this.articleImageRepository.save(createdImage));

      sortOrder++;
    }

    return result;
  }

  findAll() {
    return `This action returns all articleImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleImage`;
  }

  update(id: number, updateArticleImageDto: UpdateArticleImageDto) {
    return `This action updates a #${id} articleImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleImage`;
  }
}
