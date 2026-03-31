import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException("Email já cadastrado.");

    const salonSlug = dto.salonSlug?.trim() ? slugify(dto.salonSlug) : slugify(dto.salonName);
    const salon = await this.prisma.salon.create({
      data: {
        name: dto.salonName.trim(),
        slug: salonSlug,
        primaryColor: dto.primaryColor ?? null,
      },
    });

    const passwordHash = await bcrypt.hash(dto.password.trim(), 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name.trim(),
        password: passwordHash,
        role: dto.role ?? "admin",
        salonId: salon.id,
      },
      select: { id: true, email: true, name: true, role: true, salonId: true },
    });

    const token = this.sign(user);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Credenciais inválidas.");

    const ok = await bcrypt.compare(dto.password.trim(), user.password);
    if (!ok) throw new UnauthorizedException("Credenciais inválidas.");

    const publicUser = { id: user.id, email: user.email, name: user.name, role: user.role, salonId: user.salonId };
    const token = this.sign(publicUser);
    return { user: publicUser, token };
  }

  private sign(user: { id: string; email: string; name: string; role: string; salonId: string }) {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      salonId: user.salonId,
    });
  }
}
