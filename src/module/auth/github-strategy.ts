import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>("GITHUB_CLIENT_ID")!,
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET")!,
      callbackURL: configService.get<string>("GITHUB_CALLBACK_URL")!,
      scope: ["user:email"],
      });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      const { emails, name, photos, username, displayName } = profile;

      const user = {
        username,
        email: emails[0].value,
        displayName,
        profilePicture: photos[0]?.value || "",
        accessToken,
      };

      done(null, profile );
    } catch (error) {
      done(error, null);
    }
  }
}
