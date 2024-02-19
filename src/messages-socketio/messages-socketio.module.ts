import { Module } from '@nestjs/common';

import { MessagesWsGateway } from './messages-socketio.gateway';
import { MessagesWsService } from './messages-socketio.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [ AuthModule ]
})
export class MessagesSocketioModule {}