import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { User } from "../entities/user.entity";
interface AuthRequest extends Request {
    user: User;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
            status: string;
            level: number;
            points: number;
            streak: number;
            codename: string | null;
            avatarBase: string;
            avatarColor: string;
            avatarGear: string;
            onboardingDone: boolean;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
            status: string;
            level: number;
            points: number;
            streak: number;
            codename: string | null;
            avatarBase: string;
            avatarColor: string;
            avatarGear: string;
            onboardingDone: boolean;
        };
    }>;
    deleteMe(req: AuthRequest): Promise<{
        deleted: boolean;
    }>;
}
export {};
