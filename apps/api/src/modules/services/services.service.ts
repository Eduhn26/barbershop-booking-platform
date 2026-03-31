import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateServiceDto } from "./dto/service.dto";

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  list(salonId: string) {
    return this.prisma.service.findMany({ where: { salonId }, orderBy: { name: "asc" } });
  }

  create(salonId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        salonId,
        name: dto.name.trim(),
        priceCents: dto.priceCents,
        durationMinutes: dto.durationMinutes,
      },
    });
  }
}
