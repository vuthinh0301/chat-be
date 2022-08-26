import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/user.schema';
import { Public } from '@/decorators/public.decorator';
import { CacheService } from '../cache/cache.service';
import { TOKEN_BLACK_LIST } from '@/constants/cache.constant';
import { ConfigService } from '@nestjs/config';
import { AuthCodeResponse } from '@/dtos/error-code-response.dto';
import {
  BLOCKED,
  DELETED,
  INACTIVE,
  WRONG_USER_OR_PASSWORD,
} from '@/constants/error-codes.constant';
import { LoginResponseDto } from './dto/login.response.dto';
import {
  AuthApiError,
  PublicApiError,
} from '@/decorators/api-error-response.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @AuthCodeResponse(WRONG_USER_OR_PASSWORD, INACTIVE, BLOCKED, DELETED)
  @ApiOkResponse({ type: LoginResponseDto })
  @PublicApiError()
  @Post('login')
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.login(req.user);

    return user;
  }

  @ApiBearerAuth()
  @AuthApiError()
  @Post('logout')
  async logout(@Request() req) {
    const authorization = req.headers?.authorization;
    if (authorization) {
      const splits = authorization.split(' ');
      if (splits.length > 1) {
        const token = splits[1];

        if (token) {
          await this.cacheService.set(
            `${TOKEN_BLACK_LIST}${token}`,
            1,
            this.configService.get('JWT_TTL'),
          );
        }
      }
    }
  }

  @Public()
  @ApiCreatedResponse({ type: User })
  @PublicApiError()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return user;
  }

  @Public()
  @ApiNoContentResponse()
  @PublicApiError()
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
  }
}
