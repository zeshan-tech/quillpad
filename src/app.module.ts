import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://zeshanshakil0:S2bFsu5g0IMlsP1o@blog.o5qwk4d.mongodb.net/',
    ),
    UserModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}