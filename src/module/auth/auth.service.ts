import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { Auth } from "./entities/auth.entity";
import { CreateAuthDto } from "./dto/create-auth.dto";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Transporter } from "nodemailer";
import { Repository } from "typeorm";
import { VerifyAuthDto } from "./dto/verify-auth.dto";

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aziazi22t@gmail.com",
        pass: process.env.APP_KEY,
      },
    });
  }

  async register(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    try {
      const { username, email, password } = createAuthDto;

      const foundedUser = await this.authRepository.findOne({
        where: { email },
      });

      if (foundedUser) throw new BadRequestException("email already exists");

      const hashPassword = await bcrypt.hash(password, 16);

      const code = Array.from({ length: 7 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "aziazi22t@gmail.com",
        to: email,
        subject: "Otp",
        text: "simple",
        html: `<b>Hello World ${code}<b>`,
      });

      const time = Date.now() + 240000;

      const user = this.authRepository.create({
        username,
        email,
        password: hashPassword,
        otp: code,
        otpTime: time,
      });

      await this.authRepository.save(user);

      return { message: "User deleted" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // verify

  async verify(verifyAuthDto: VerifyAuthDto): Promise<{ acces_token: string }> {
    try {
      const { email, otp } = verifyAuthDto;

      const foundedUser = await this.authRepository.findOne({
        where: { email },
      });

      if (!foundedUser) throw new NotFoundException("user not found");

      const otpValidation = /^\d{6}$/.test(otp);

      if (!otpValidation) {
        throw new BadRequestException("wrong otp validation");
      }
      const time = Date.now();

      if (time > foundedUser.otpTime) {
        throw new BadRequestException("otp expired");
      }

      if (otp != foundedUser.otp) {
        throw new BadRequestException("wrong otp");
      }

      const payload = {
        id: foundedUser.id,
        email: foundedUser.email,
        role: foundedUser.role,
      };

      const acces_token = await this.jwtService.signAsync(payload);

      return { acces_token };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async login(
  //   loginAuthDto: LoginAuthDto,
  // ): Promise<{ token: string } | { message: string }> {
  //   const { email, password } = loginAuthDto;

  //   const foundedUser = await this.authModel.findOne({
  //     where: { email },
  //   });

  //   if (!foundedUser) throw new UnauthorizedException("user not found");

  //   const comp = await bcrypt.compare(
  //     password,
  //     foundedUser.dataValues.password,
  //   );

  //   if (comp) {
  //     return {
  //       token: await this.jwtService.signAsync({ email: foundedUser.email }),
  //     };
  //   }

  //   return { message: "invalid password" };
  // }

  // async findAll(): Promise<Auth[]> {
  //   return await this.authModel.findAll();
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  async remove(id: number): Promise<boolean> {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException("user not found");

    await this.authRepository.delete(id);

    return true;
  }
}
