import { IsInt, IsString, Min } from "class-validator";

export class CreateServiceDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(0)
  priceCents!: number;

  @IsInt()
  @Min(5)
  durationMinutes!: number;
}
