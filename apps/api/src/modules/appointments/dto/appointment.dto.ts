import { IsIn, IsOptional, IsString } from "class-validator";

export class CreateAppointmentDto {
  @IsString()
  stylistId!: string;

  @IsString()
  serviceId!: string;

  @IsString()
  date!: string; // YYYY-MM-DD

  @IsString()
  time!: string; // HH:mm

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentStatusDto {
  @IsIn(["pending", "confirmed", "cancelled", "completed"])
  status!: "pending" | "confirmed" | "cancelled" | "completed";
}
