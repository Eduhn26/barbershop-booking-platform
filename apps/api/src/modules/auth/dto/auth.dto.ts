import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  salonName!: string;

  @IsOptional()
  @IsString()
  salonSlug?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsIn(["admin", "client", "stylist"])
  role?: "admin" | "client" | "stylist";
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
