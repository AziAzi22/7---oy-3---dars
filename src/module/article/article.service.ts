import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { In, Repository, ReturnDocument } from "typeorm";
import { Tag } from "../tags/entities/tag.entity";
import { Auth } from "../auth/entities/auth.entity";
import { QueryArticleDto } from "./dto/query-article.dto";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  // create

  async create(
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
    userId: Auth,
  ): Promise<Article> {
    try {
      const tags = await this.tagRepo.findBy({ id: In(createArticleDto.tags) });

      const article = this.articleRepo.create({
        ...createArticleDto,
        tags,
        author: userId,
      });

      article.backgroundImage = `http://localhost:4001/uploads/${file.filename}`;

      return this.articleRepo.save(article);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // findAll

  async findAll(query: QueryArticleDto): Promise<Article[]> {
    try {
      const { page = 1, limit = 10, search } = query;

      const queryBuilder = await this.articleRepo
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.author", "author")
        .leftJoinAndSelect("article.tags", "tags")
        .where("article.isActive = :isActive", { isActive: true })
        // .andWhere("article.deletedAt = :deletedAt", { deletedAt: null })
        .andWhere("article.deletedAt is null");

      return await this.articleRepo.find({
        relations: ["author", "tags"], 
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // find all my articles

  async findAllMyArticles(userId: Auth): Promise<Article[]> {
    try {
      const articles = await this.articleRepo.find({
        where: { author: userId },
        relations: ["author", "tags"],
      });
      return articles;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // findOne

  async findOne(id: number): Promise<Article> {
    try {
      const foundedArticle = await this.articleRepo.findOne({ where: { id } });

      if (!foundedArticle) throw new NotFoundException("article not found");

      return foundedArticle;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // update

  // async update(
  //   id: number,
  //   updateArticleDto: UpdateArticleDto,
  // ): Promise<{ message: string }> {
  //   try {
  //     const foundedArticle = await this.articleRepo.findOne({ where: { id } });

  //     if (!foundedArticle) throw new NotFoundException("article not found");

  //     await this.articleRepo.update(foundedArticle.id, updateArticleDto);

  //     return { message: "article updated" };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // delete

  async remove(id: number, userId: Auth): Promise<{ message: string }> {
    try {
      const foundedArticle = await this.articleRepo.findOne({ where: { id } });

      if (!foundedArticle) throw new NotFoundException("article not found");

      await this.articleRepo.softDelete(foundedArticle.id);

      return { message: "article deleted" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
