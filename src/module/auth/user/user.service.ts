import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "../entities/auth.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Auth) private userRepository: Repository<Auth>,
  ) {}

  async findOrCreate(userDate: Partial<Auth>): Promise<Auth> {
    const foundedUser = await this.userRepository.findOne({
      where: { email: userDate.email },
    });

    if (foundedUser) {
      return foundedUser;
    }

    const user = this.userRepository.create(userDate);

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<Auth | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
