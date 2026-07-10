import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebauthnController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import { WebauthnChallengeStore } from './webauthn-challenge.store';
import { WebauthnCredential } from './entities/webauthn-credential.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebauthnCredential, User]),
    AuthModule,
  ],
  controllers: [WebauthnController],
  providers: [WebauthnService, WebauthnChallengeStore],
})
export class WebauthnModule { }