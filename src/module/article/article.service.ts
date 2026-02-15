import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { Repository, ReturnDocument } from "typeorm";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      const article = this.articleRepo.create(createArticleDto);
      return this.articleRepo.save(article);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Article[]> {
    try {
      return await this.articleRepo.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Article> {
    try {
      const foundedArticle = await this.articleRepo.findOne({ where: { id } });

      if (!foundedArticle) throw new NotFoundException("article not found");

      return foundedArticle;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<{ message: string }> {
    try {
      const foundedArticle = await this.articleRepo.findOne({ where: { id } });

      if (!foundedArticle) throw new NotFoundException("article not found");

      await this.articleRepo.update(foundedArticle.id, updateArticleDto);

      return { message: "article updated" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const foundedArticle = await this.articleRepo.findOne({ where: { id } });

      if (!foundedArticle) throw new NotFoundException("article not found");

      await this.articleRepo.delete(foundedArticle.id);

      return { message: "article deleted" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
