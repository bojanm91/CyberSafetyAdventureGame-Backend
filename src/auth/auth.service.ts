import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "../entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private buildToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
      email: user.email,
    });
  }

  private safeUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      level: user.level,
      points: user.points,
      streak: user.streak,
      codename: user.codename ?? null,
      avatarBase: user.avatarBase ?? "A",
      avatarColor: user.avatarColor ?? "#22D3EE",
      avatarGear: user.avatarGear ?? "none",
      onboardingDone: user.onboardingDone ?? false,
    };
  }

  async login(loginDto: LoginDto) {
    const user = loginDto.email
      ? await this.userRepository.findOneBy({ email: loginDto.email.toLowerCase() })
      : await this.userRepository.findOneBy({ username: loginDto.username });

    if (!user) throw new UnauthorizedException("Neispravni kredencijali.");

    const passwordMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException("Neispravni kredencijali.");

    return { accessToken: this.buildToken(user), user: this.safeUser(user) };
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException("Lozinke se ne poklapaju.");
    }

    const exists = await this.userRepository.findOne({
      where: [
        { email: registerDto.email.toLowerCase() },
        { username: registerDto.username },
      ],
    });
    if (exists) throw new BadRequestException("Korisnik već postoji.");

    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    const user = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email.toLowerCase(),
      passwordHash,
      status: "Cyber Rookie",
      level: 1,
      points: 0,
      streak: 0,
    });

    await this.userRepository.save(user);
    return { accessToken: this.buildToken(user), user: this.safeUser(user) };
  }
}
