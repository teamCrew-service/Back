import { Module, forwardRef } from '@nestjs/common';
import { CrewService } from './crew.service';
import { HomeModule } from 'src/home/home.module';
import { CrewRepository } from './crew.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from './entities/crew.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crew]), forwardRef(() => HomeModule)],
  providers: [CrewService, CrewRepository],
  exports: [CrewService, CrewRepository],
})
export class CrewModule {}