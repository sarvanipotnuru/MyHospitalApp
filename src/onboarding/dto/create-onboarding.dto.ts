// create-onboarding.dto.ts
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CreateOnboardingDto {
  @IsNumber()
  stepId: number;

  @IsObject()
  data: Record<string, any>;

  @IsNumber()
  patientId: number;
}
