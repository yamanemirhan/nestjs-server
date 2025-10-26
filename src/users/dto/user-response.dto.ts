import { $Enums } from 'generated/prisma';

export class UserResponseDto {
  userId: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: $Enums.Role;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UserResponseWithPasswordDto {
  userId: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  role: $Enums.Role;

  constructor(partial: Partial<UserResponseWithPasswordDto>) {
    Object.assign(this, partial);
  }
}
