import { BaseEntity } from "../../../database/base.entity";
import { Article } from "../../article/entities/article.entity";
import { Tag } from "../../tags/entities/tag.entity";
import { UserRole } from "../../../shared/constants/user-role.constants";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "auth" })
export class Auth extends BaseEntity {
  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    default: 0,
    // nullable: true
  })
  otp: string;

  @Column({ type: "bigint", nullable: true })
  otpTime: number;

  @Column({ default: UserRole.USER })
  role: UserRole;

  // extra info

  @Column({ nullable: true })
  fisrtname?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  bio?: string;

  // relations

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Tag, (tag) => tag.createdBy)
  tags: Tag[];  
}

// npm i @nestjs/passport passport passport-github2 passport-google-oauth2 passport-jwt 
// npm i @nestjs-jwt @nestjs/mongoose mongoose
// npm i --save-dev @types/passport-jwt  @types/passport-google-oauth2 @types/passport-github2
