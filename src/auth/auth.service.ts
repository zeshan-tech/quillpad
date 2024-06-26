import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async authenticateUser(_id: string): Promise<void> {
    try {
      const userExist = await this.userService.isUserExistById(_id);

      if (!userExist) {
        throw new UnauthorizedException('Invalid authorization specified');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  signToken(user: User): string {
    const tokenUser = {
      email: user.email,
      _id: user._id,
    };
    const token = this.jwtService.sign(tokenUser);
    return token;
  }

  decodeToken(token: string): TokenUserType {
    const tokenUser = this.jwtService.decode(token);
    return tokenUser as TokenUserType;
  }
}
