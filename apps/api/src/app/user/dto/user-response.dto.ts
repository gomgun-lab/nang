import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User name', nullable: true })
  name: string | null;

  @ApiProperty({ description: 'User creation timestamp' })
  createdAt: string;
}
