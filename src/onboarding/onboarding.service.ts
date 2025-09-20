// onboarding.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnboardingProgress } from '../entities/onboarding-progress.entity';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(OnboardingProgress)
    private readonly onboardingRepo: Repository<OnboardingProgress>,
  ) {}

  async saveStep(dto: CreateOnboardingDto) {
    // ✅ Ensure patient exists before inserting
    const progress = this.onboardingRepo.create({
      stepId: dto.stepId,
      data: dto.data,
      patientId: dto.patientId,
    });

    return this.onboardingRepo.save(progress);
  }

  async getProgress(patientId: number) {
    return this.onboardingRepo.find({
      where: { patientId },
      order: { stepId: 'ASC' },
    });
  }
}
