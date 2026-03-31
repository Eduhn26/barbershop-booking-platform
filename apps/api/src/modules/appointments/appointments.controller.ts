import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from "./dto/appointment.dto";

@Controller("appointments")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AppointmentsController {
  constructor(private appts: AppointmentsService) {}

  @Get("busy")
  busy(@CurrentUser() user: any, @Query("stylistId") stylistId: string, @Query("date") date: string) {
    return this.appts.busyTimes(user.salonId, stylistId, date);
  }

  @Post()
  @Roles("client")
  create(@CurrentUser() user: any, @Body() dto: CreateAppointmentDto) {
    return this.appts.create(user.salonId, user.id, dto);
  }

  @Get("my")
  @Roles("client")
  my(@CurrentUser() user: any) {
    return this.appts.myAppointments(user.salonId, user.id);
  }

  @Get("stylist-schedule")
  @Roles("stylist")
  stylistSchedule(@CurrentUser() user: any, @Query("date") date: string) {
    return this.appts.stylistSchedule(user.salonId, user.id, date);
  }

  @Put("status")
  @Roles("admin", "stylist")
  updateStatus(
    @CurrentUser() user: any,
    @Query("id") appointmentId: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appts.updateStatus(user.salonId, appointmentId, dto);
  }
}
