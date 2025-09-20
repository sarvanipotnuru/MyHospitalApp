import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    // 1️⃣ Check if user already exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3️⃣ Create User + pass role-specific data
    const user = await this.usersService.createUser(
      dto.name,
      dto.email,
      dto.role,
      hashedPassword,
      'local',
      dto.role === 'doctor'
        ? {
            specialization: dto.specialization ?? '',
            experience: dto.experience ?? 0,
            scheduleType: dto.scheduleType,
            consultingStart: dto.consultingStart,
            consultingEnd: dto.consultingEnd,
            slotDuration: dto.slotDuration,
            capacityPerSlot: dto.capacityPerSlot,
            dailyCapacity: dto.dailyCapacity,
          }
        : undefined,
      dto.role === 'patient'
        ? {
            age: dto.age ?? 0,
            gender: dto.gender ?? null,
            medicalHistory: dto.medicalHistory ?? '',
          }
        : undefined,
    );

    return user;
  }
}
