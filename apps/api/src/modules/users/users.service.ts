import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  listStylists(salonId: string) {
    return this.prisma.user.findMany({
      where: { salonId, role: "stylist" },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, salonId: true },
      orderBy: { name: "asc" },
    });
  }
}
