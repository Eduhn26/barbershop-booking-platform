import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from "./dto/appointment.dto";

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async busyTimes(salonId: string, stylistId: string, date: string) {
    const appts = await this.prisma.appointment.findMany({
      where: { salonId, stylistId, date, status: { in: ["pending", "confirmed"] } },
      select: { time: true },
      orderBy: { time: "asc" },
    });
    return appts.map(a => a.time);
  }

  async create(salonId: string, clientId: string, dto: CreateAppointmentDto) {
    const service = await this.prisma.service.findFirst({ where: { id: dto.serviceId, salonId } });
    if (!service) throw new BadRequestException("Serviço inválido.");

    try {
      return await this.prisma.appointment.create({
        data: {
          salonId,
          clientId,
          stylistId: dto.stylistId,
          date: dto.date,
          time: dto.time,
          status: "pending",
          serviceId: service.id,
          serviceNameSnapshot: service.name,
          servicePriceCentsSnapshot: service.priceCents,
          serviceDurationMinutesSnapshot: service.durationMinutes,
          notes: dto.notes?.trim() ?? null,
        },
      });
    } catch (e: any) {
      // conflito de índice único
      if (e?.code === "P2002") {
        throw new BadRequestException("Horário indisponível para este barbeiro.");
      }
      throw e;
    }
  }

  myAppointments(salonId: string, clientId: string) {
    return this.prisma.appointment.findMany({
      where: { salonId, clientId },
      include: { stylist: { select: { id: true, name: true } } },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });
  }

  stylistSchedule(salonId: string, stylistId: string, date: string) {
    return this.prisma.appointment.findMany({
      where: { salonId, stylistId, date, status: { in: ["pending", "confirmed", "completed"] } },
      include: {
        client: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
      orderBy: { time: "asc" },
    });
  }

  updateStatus(salonId: string, appointmentId: string, dto: UpdateAppointmentStatusDto) {
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: dto.status },
    });
  }
}
