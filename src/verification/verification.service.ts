import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/Patient';


const otpStore = new Map<string, string>();

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async sendOtp(email: string) {
    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    // TODO: send via email/SMS
    console.log(`OTP for ${email}: ${otp}`);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    const savedOtp = otpStore.get(email);
    if (!savedOtp) {
      throw new BadRequestException('No OTP found for this email');
    }

    if (savedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Find patient by email (via relation with User)
    const patient = await this.patientRepo.findOne({
      where: { user: { email } },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found for this email');
    }

    // Mark patient as verified
    patient.isVerified = true;
    await this.patientRepo.save(patient);

    otpStore.delete(email);

    return {
      status: 'verified',
      patientId: patient.id,
      email,
    };
  }
}
