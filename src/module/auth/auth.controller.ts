import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { VerifyAuthDto } from "./dto/verify-auth.dto";
import { ApiBody } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // google

  @Get("google")
  @UseGuards(AuthGuard("google"))
  authGoogle() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleRedirect(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }

  // github

  @Get("github")
  @UseGuards(AuthGuard("github"))
  authGithub() {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  githubRedirect(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }

  @ApiBody({ type: CreateAuthDto })
  @HttpCode(200)
  @Post("register")
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiBody({ type: VerifyAuthDto })
  @HttpCode(200)
  @Post("verify")
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto);
  }

  @ApiBody({ type: LoginAuthDto })
  @HttpCode(200)
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.authService.remove(+id);
  }
}
