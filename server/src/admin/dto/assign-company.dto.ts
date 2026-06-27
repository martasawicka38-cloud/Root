import { IsString } from "class-validator";

export class AssignCompanyDto {
  @IsString()
  companyId!: string;
}
