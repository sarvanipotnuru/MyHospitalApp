import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/User';
import { Patient } from './entities/Patient';
import { Doctor } from './entities/Doctor';
import { OnboardingProgress } from './entities/onboarding-progress.entity';
import { Appointment } from './entities/appointment.entity';
import { Availability } from './entities/Availability';

import { VerificationModule } from './verification/verification.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AppointmentModule } from './appointments/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';

@Module({
  imports: [
    // Loads .env variables so process.env.* works
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Database configuration (local OR Render)
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Render will set DATABASE_URL. If present, we use it.
      url: process.env.DATABASE_URL || undefined,

      // If DATABASE_URL is NOT present (local dev), fall back to individual vars
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME || 'postgres',
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || 'root',
      database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'PearlThoughts',

      entities: [User, Patient, Doctor, OnboardingProgress, Appointment, Availability],
      synchronize: true, // ⚠️ Disable in production if you use migrations
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),

    // ✅ Feature modules
    AuthModule,
    VerificationModule,
    OnboardingModule,
    DoctorModule,
    AppointmentModule,
    AvailabilityModule,
  ],
})
export class AppModule {}
