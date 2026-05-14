import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private readonly users;
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
