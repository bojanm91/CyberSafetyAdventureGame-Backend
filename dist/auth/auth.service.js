"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    users = [
        {
            id: "user-demo-1",
            username: "Bojan",
            email: "bojan@example.com",
            password: "password123",
            status: "Junior Defender",
        },
    ];
    login(loginDto) {
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
            throw new common_1.UnauthorizedException("Neispravni kredencijali.");
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
    register(registerDto) {
        if (registerDto.password !== registerDto.confirmPassword) {
            throw new common_1.BadRequestException("Lozinke se ne poklapaju.");
        }
        const existingUser = this.users.find((entry) => entry.email.toLowerCase() === registerDto.email.toLowerCase() ||
            entry.username.toLowerCase() === registerDto.username.toLowerCase());
        if (existingUser) {
            throw new common_1.BadRequestException("Korisnik već postoji.");
        }
        const user = {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map