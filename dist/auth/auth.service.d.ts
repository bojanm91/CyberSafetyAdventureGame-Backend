import { JwtService } from "@nestjs/jwt";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly dataSource;
    constructor(userRepository: Repository<User>, jwtService: JwtService, dataSource: DataSource);
    private buildToken;
    private safeUser;
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
    deleteMe(userId: string): Promise<{
        deleted: boolean;
    }>;
}
