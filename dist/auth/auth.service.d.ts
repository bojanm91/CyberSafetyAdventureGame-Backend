import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
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
        };
    }>;
}
