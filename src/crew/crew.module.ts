import { Module, forwardRef } from '@nestjs/common';
import { CrewService } from './crew.service';
import { HomeModule } from 'src/home/home.module';
import { CrewRepository } from './crew.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from './entities/crew.entity';
import { CrewController } from './crew.controller';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crew]),
    forwardRef(() => HomeModule),
    forwardRef(() => MemberModule),
  ],
  providers: [CrewService, CrewRepository],
  exports: [CrewService, CrewRepository],
  controllers: [CrewController],
})
export class CrewModule {}
