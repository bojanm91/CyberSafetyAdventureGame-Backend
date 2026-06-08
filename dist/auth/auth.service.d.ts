import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Result } from "../entities/result.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private readonly userRepository;
    private readonly resultRepository;
    private readonly userBadgeRepository;
    private readonly progressRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, resultRepository: Repository<Result>, userBadgeRepository: Repository<UserBadge>, progressRepository: Repository<UserQuestProgress>, jwtService: JwtService);
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
