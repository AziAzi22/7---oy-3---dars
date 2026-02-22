import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { Repository } from "typeorm";
import { Auth } from "../auth/entities/auth.entity";

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async create(createTagDto: CreateTagDto, userId: Auth) {
    const foundedTag = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });

    if (foundedTag) throw new BadRequestException("tag already exists");

    const tag = this.tagRepository.create({
      ...createTagDto,
      createdBy: userId,
    });
    return this.tagRepository.save(tag);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
