import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Create an account' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Create JWT authentication' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh JWT authentication' })
    refresh(@Body() refreshDto: RefreshDto) {
        return this.authService.refresh(refreshDto);
    }

    @Post('logout')
    @HttpCode(204)
    @ApiOperation({ summary: 'Log out the user' })
    logout(@Body() logoutDto: RefreshDto) {
        return this.authService.logout(logoutDto);
    }
}
