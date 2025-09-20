import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { Patient } from '../entities/Patient';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
