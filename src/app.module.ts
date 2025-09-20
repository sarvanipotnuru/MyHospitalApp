import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './entities/User';
import { Patient } from './entities/Patient';
import { Doctor } from './entities/Doctor';
import { OnboardingProgress } from './entities/onboarding-progress.entity';
import { Appointment } from './entities/appointment.entity';
import { Availability } from './entities/Availability'; // ✅ import it

import { VerificationModule } from './verification/verification.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AppointmentModule } from './appointments/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module'; // ✅ import module

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'PearlThoughts',
      entities: [
        User,
        Patient,
        Doctor,
        OnboardingProgress,
        Appointment,
        Availability, // ✅ add here
      ],
      synchronize: true, // ⚠️ remove in production
    }),

    // Feature modules
    AuthModule,
    VerificationModule,
    OnboardingModule,
    DoctorModule,
    AppointmentModule,
    AvailabilityModule, // ✅ register the new module
  ],
})
export class AppModule {}
