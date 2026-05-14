import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

type UserRecord = {
  id: string;
  username: string;
  email: string;
  password: string;
  status: string;
};

@Injectable()
export class AuthService {
  private readonly users: UserRecord[] = [
    {
      id: "user-demo-1",
      username: "Bojan",
      email: "bojan@example.com",
      password: "password123",
      status: "Junior Defender",
    },
  ];

  login(loginDto: LoginDto) {
    const user = this.users.find((entry) => {
      if (loginDto.email) {
        return entry.email.toLowerCase() === loginDto.email.toLowerCase();
      }

      if (loginDto.username) {
        return entry.username.toLowerCase() === loginDto.username.toLowerCase();
      }

      return false;
    });

    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException("Neispravni kredencijali.");
    }

    return {
      accessToken: "demo-token-" + user.id,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
    };
  }

  register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException("Lozinke se ne poklapaju.");
    }

    const existingUser = this.users.find(
      (entry) =>
        entry.email.toLowerCase() === registerDto.email.toLowerCase() ||
        entry.username.toLowerCase() === registerDto.username.toLowerCase(),
    );

    if (existingUser) {
      throw new BadRequestException("Korisnik već postoji.");
    }

    const user: UserRecord = {
      id: `user-${this.users.length + 1}`,
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      status: "Cyber Rookie",
    };

    this.users.push(user);

    return {
      accessToken: "demo-token-" + user.id,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
    };
  }
}
