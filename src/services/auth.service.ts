import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDocument> {
    const user = await this.userService.findOne(username);
    if (!user) throw new Error('Invalid user');

    const { password, ...userObject } = user.toObject();

    const matchPassword = await bcrypt.compare(pass, password);
    if (!matchPassword) throw new Error('Invalid password');

    return userObject;
  }

  async login(user: UserDocument) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: { username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.create({
      username: user.username,
      password: hashedPassword,
    });
    return newUser.toObject();
  }

  async recover({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const user = await this.userService.findOne(username);
    if (!user) throw new Error('Invalid user');

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.changePassword(username, hashedPassword);
  }
}
