import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UsersController {
  constructor(private users: UsersService) {}

  @Get("stylists")
  listStylists(@CurrentUser() user: any) {
    return this.users.listStylists(user.salonId);
  }
}
