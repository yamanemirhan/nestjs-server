import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from 'src/auth/sign-up-user.dto';
import { hashPassword } from 'src/common/utils/password.util';
import { DatabaseService } from 'src/database/database.service';
import {
  UserResponseDto,
  UserResponseWithPasswordDto,
} from './dto/user-response.dto';
import { Result } from 'src/common/base-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async findById(userId: string) {
    return this.databaseService.user.findUnique({
      where: { userId },
    });
  }

  async getProfile(userId: string): Promise<Result<UserResponseDto>> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const userResponse: UserResponseDto = new UserResponseDto({
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role,
    });

    return {
      success: true,
      statusCode: 200,
      data: userResponse,
      message: 'Kullanıcı profili başarıyla getirildi',
    };
  }

  async findOne(username: string): Promise<UserResponseWithPasswordDto | null> {
    const user = await this.databaseService.user.findUnique({
      where: { username: username },
    });
    if (!user) return null;

    return new UserResponseWithPasswordDto({
      userId: user.userId,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: user.password,
      email: user.email,
      role: user.role,
    });
  }

  async createUser(signUpUserDto: SignUpUserDto): Promise<UserResponseDto> {
    const existingUser = await this.databaseService.user.findUnique({
      where: { username: signUpUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Bu kullanıcı adı zaten alınmış');
    }

    const hashedPassword = await hashPassword(signUpUserDto.password);

    const newUser = await this.databaseService.user.create({
      data: {
        username: signUpUserDto.username,
        password: hashedPassword,
        email: signUpUserDto.email,
        refreshToken: '',
      },
    });

    const refreshToken = this.jwtService.sign(
      { sub: newUser.userId },
      { expiresIn: '7d', secret: process.env.REFRESH_SECRET },
    );

    await this.databaseService.user.update({
      where: { userId: newUser.userId },
      data: { refreshToken },
    });

    return new UserResponseDto({
      userId: newUser.userId,
      username: newUser.username,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  }
}
