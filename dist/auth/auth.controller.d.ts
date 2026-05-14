import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): {
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
            status: string;
        };
    };
    register(registerDto: RegisterDto): {
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
            status: string;
        };
    };
}
