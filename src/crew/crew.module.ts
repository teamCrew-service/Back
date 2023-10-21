import { Module, forwardRef } from '@nestjs/common';
import { CrewService } from './crew.service';
import { HomeModule } from 'src/home/home.module';
import { CrewRepository } from './crew.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from './entities/crew.entity';
import { CrewController } from './crew.controller';
import { SignupModule } from 'src/signup/signup.module';
import { MemberModule } from 'src/member/member.module';
import { scheduleModule } from 'src/schedule/schedule.module';
import { LikeModule } from 'src/like/like.module';
import { NoticeModule } from 'src/notice/notice.module';
import { VoteFormModule } from 'src/voteform/voteform.module';
import { ImageModule } from 'src/image/image.module';
import { TopicModule } from 'src/topic/topic.module';
import { LeavecrewModule } from 'src/leavecrew/leavecrew.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crew]),
    forwardRef(() => HomeModule),
    forwardRef(() => SignupModule),
    forwardRef(() => MemberModule),
    forwardRef(() => scheduleModule),
    forwardRef(() => LikeModule),
    forwardRef(() => NoticeModule),
    forwardRef(() => VoteFormModule),
    forwardRef(() => ImageModule),
    forwardRef(() => TopicModule),
    forwardRef(() => LeavecrewModule),
    forwardRef(() => ChatModule),
  ],
  providers: [CrewService, CrewRepository],
  exports: [CrewService, CrewRepository],
  controllers: [CrewController],
})
export class CrewModule {}
