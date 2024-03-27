import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthManager } from './token.manager';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../user/schema/user.schema';
import { Model } from 'mongoose';

export class TestServer {
  public authToken: string;
  public app: INestApplication;
  public authManager: AuthManager;
  public httpServer: any;

  async init(modules: any[]): Promise<void> {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'jwtConstants.secret',
          signOptions: { expiresIn: '1d' },
        }),
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ...modules,
      ],
      controllers: [],
      providers: [AuthManager],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.httpServer = await this.app.getHttpServer();
    this.authManager = moduleFixture.get<AuthManager>(AuthManager);
    this.app.enableCors();
    await this.app.init();
  }

  async close(): Promise<void> {
    await this.app.close();
  }

  async setup(modules: any[]) {
    await this.init(modules);
  }

  async insertTestData<T>(UserModel: Model<T>, data: Record<string, any>): Promise<T[]> {
    try {
      return (await UserModel.insertMany(data)) as T[];
    } catch (error) {
      throw new Error(error);
    }
  }
}