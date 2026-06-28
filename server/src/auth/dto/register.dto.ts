import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export enum RegisterRole {
  user = "user",
  employer = "employer",
  company = "company",
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(RegisterRole)
  role!: RegisterRole;

  @IsOptional()
  @IsString()
  partner?: string;

  @IsOptional()
  @IsString()
  companyToken?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companySlug?: string;
}
