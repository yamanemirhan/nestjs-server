import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './sign-in-user.dto';
import { SignUpUserDto } from './sign-up-user.dto';
import { comparePassword } from 'src/common/utils/password.util';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { TokenResponseDto } from './token-response.dto';
import { DatabaseService } from 'src/database/database.service';
import { Result } from 'src/common/base-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  async signUp(
    signUpUserDto: SignUpUserDto,
  ): Promise<Result<TokenResponseDto>> {
    const user = await this.usersService.findOne(signUpUserDto.username);
    if (user) {
      throw new ConflictException('Bu kullanıcı adı zaten alınmış');
    }

    const emailExistingUser = await this.databaseService.user.findUnique({
      where: { email: signUpUserDto.email },
    });
    if (emailExistingUser) {
      throw new ConflictException('Bu e-posta adresi zaten alınmış');
    }

    const newUser = await this.usersService.createUser(signUpUserDto);

    const tokens = await this.generateTokens(newUser.userId);

    return {
      success: true,
      statusCode: 201,
      data: tokens,
      message: 'Kayıt başarılı, giriş yapılıyor...',
    };
  }

  async signIn(
    signInUserDto: SignInUserDto,
  ): Promise<Result<TokenResponseDto>> {
    const user = await this.usersService.findOne(signInUserDto.username);
    if (!user)
      throw new UnauthorizedException('Yanlış kullanıcı adı veya şifre');
    if (
      !user ||
      !(await comparePassword(signInUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Yanlış kullanıcı adı veya şifre');
    }

    const userResponse = new UserResponseDto({
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const tokens = await this.generateTokens(userResponse.userId);

    return {
      success: true,
      statusCode: 200,
      data: tokens,
      message: 'Giriş başarılı',
    };
  }

  async refreshTokens(refreshToken: string): Promise<Result<TokenResponseDto>> {
    const user = await this.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Geçersiz refresh token');
    }

    const tokens = await this.generateTokens(user.userId);

    return {
      success: true,
      statusCode: 200,
      data: tokens,
      message: 'Tokenlar başarıyla yenilendi',
    };
  }

  async generateTokens(userId: string) {
    const payload = { sub: userId };

    // access token
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '15d',
      secret: process.env.REFRESH_SECRET,
    });

    // save refresh token
    await this.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<UserResponseDto | null> {
    const payload = this.jwtService.verify(token, {
      secret: process.env.REFRESH_SECRET,
    });

    const user = await this.usersService.findById(payload.sub);
    if (!user || user.refreshToken !== token) return null;
    return new UserResponseDto({
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.databaseService.user.update({
      where: { userId },
      data: { refreshToken },
    });
  }
}
