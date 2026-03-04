import { Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Auth } from "./entities/auth.entity";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { JWTStrategy } from "./jwt-strategy";
import { GoogleStrategy } from "./google-strategy";
import { GithubStrategy } from "./github-strategy";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      global: true,
      secret: String(process.env.SECRET_KEY),
      signOptions: { expiresIn: "2d" },
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, GoogleStrategy, GithubStrategy],
})
export class AuthModule {}
