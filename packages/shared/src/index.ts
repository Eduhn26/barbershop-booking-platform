export type Role = "admin" | "client" | "stylist";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  salonId: string;
};

export type ServiceDTO = {
  id: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
  salonId: string;
};

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type AppointmentDTO = {
  id: string;
  salonId: string;
  clientId: string;
  stylistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;

  serviceId: string;
  serviceNameSnapshot: string;
  servicePriceCentsSnapshot: number;
  serviceDurationMinutesSnapshot: number;

  notes?: string | null;
};
