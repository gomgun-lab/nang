import * as bcrypt from 'bcrypt';
import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../../config/database/prisma.service';
import { BaseException } from '../../exception/base.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Validate user credentials (used by LocalStrategy)
   */
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        credentials: {
          where: {
            type: 'EMAIL',
          },
        },
      },
    });

    if (!user || user.credentials.length === 0) {
      throw new BaseException({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const emailCredential = user.credentials[0];

    if (!emailCredential.passwordHash) {
      throw new BaseException({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const isPasswordValid = await this.comparePassword(
      password,
      emailCredential.passwordHash
    );

    if (!isPasswordValid) {
      throw new BaseException({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return user;
  }

  /**
   * Register a new user
   */
  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BaseException({
        code: 'CONFLICT',
        message: 'Email already exists',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    // Hash password
    const hashedPassword = await this.hashPassword(dto.password);

    // Create user with email credential
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        credentials: {
          create: {
            type: 'EMAIL',
            provider: 'EMAIL',
            providerId: dto.email,
            passwordHash: hashedPassword,
          },
        },
      },
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  /**
   * Login user and generate JWT token
   */
  async login(user: any) {
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: any): string {
    const payload = {
      sub: user.id.toString(),
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plain password with hashed password
   */
  private async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new BaseException({
        code: 'NOT_FOUND',
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
