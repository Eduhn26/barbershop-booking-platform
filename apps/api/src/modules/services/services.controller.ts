import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { CreateServiceDto } from "./dto/service.dto";
import { ServicesService } from "./services.service";

@Controller("services")
@UseGuards(AuthGuard("jwt"))
export class ServicesController {
  constructor(private services: ServicesService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.services.list(user.salonId);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateServiceDto) {
    return this.services.create(user.salonId, dto);
  }
}
