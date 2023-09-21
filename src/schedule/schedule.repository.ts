import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { EditScheduleDto } from './dto/editSchedule.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  // 일정 조회
  async findSchedule(userId: number): Promise<any> {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.userId', 'users') // users 테이블과 조인하여 profileImage를 가져옴
      .leftJoin('schedule.crewId', 'crew') // crew 테이블과의 join
      .leftJoin('crew.member', 'member') // crew와 member 테이블과의 join
      .where('member.userId = :userId', { userId }) // 해당 userId를 가진 멤버만 필터링
      .select([
        'schedule.scheduleTitle',
        'schedule.scheduleDDay',
        'users.profileImage',
      ]) // 필요한 필드만 선택
      .getMany();

    return schedules;
  }

  // 일정 생성
  async createSchedule(
    createScheduleDto: CreateScheduleDto,
    userId: number,
    crewId: number,
  ): Promise<Schedule> {
    const schedule = new Schedule();
    schedule.userId = userId;
    schedule.crewId = crewId;
    schedule.scheduleTitle = createScheduleDto.scheduleTitle;
    schedule.scheduleContent = createScheduleDto.scheduleContent;
    schedule.scheduleDDay = createScheduleDto?.scheduleDDay;
    schedule.scheduleAddress = createScheduleDto.scheduleAddress;

    const createdSchedule = await this.scheduleRepository.save(schedule);

    return createdSchedule;
  }

  // 일정 수정
  async editSchedule(
    editScheduleDto: EditScheduleDto,
    userId: number,
    crewId: number,
    scheduleId: number,
  ): Promise<any> {
    const schedule = await this.scheduleRepository.findOne({
      where: { scheduleId, userId, crewId },
    });

    // 수정할 필드만 선택적으로 업데이트
    schedule.scheduleTitle =
      editScheduleDto.scheduleTitle || schedule.scheduleTitle;
    schedule.scheduleAddress =
      editScheduleDto.scheduleAddress || schedule.scheduleAddress;
    schedule.scheduleDDay =
      editScheduleDto.scheduleDDay || schedule.scheduleDDay;
    schedule.scheduleContent =
      editScheduleDto.scheduleContent || schedule.scheduleContent;

    const updatedSchedule = await this.scheduleRepository.save(schedule);

    return updatedSchedule;
  }

  // 일정 상세 조회
  async findScheduleDetail(scheduleId: number, crewId: number): Promise<any> {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoin('schedule.crewId', 'crew') // crew 테이블과의 join
      .leftJoin('crew.member', 'member') // crew와 member 테이블과의 join
      .where('schedule.scheduleId = :scheduleId', { scheduleId }) // 해당 scheduleId를 가진 멤버만 필터링
      .andWhere('crew.crewId = :crewId', { crewId }) // 해당 crewId를 가진 멤버만 필터링
      .select([
        'schedule.scheduleTitle',
        'schedule.scheduleDDay',
        'schedule.scheduleContent',
        'schedule.scheduleAddress',
      ]) // 필요한 필드만 선택
      .getOne();

    return schedule;
  }

  // 일정 삭제
  async deleteSchedule(scheduleId: number, crewId: number): Promise<any> {
    const schedule = await this.scheduleRepository.findOne({
      where: { scheduleId, crewId },
    });

    const deletedSchedule = await this.scheduleRepository.softRemove(schedule); // soft delete

    return deletedSchedule;
  }

  /* crew에 해당하는 schedule 조회 */
  async findScheduleByCrew(crewId: number): Promise<any> {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .select([
        'scheduleTitle',
        'scheduleContent',
        'scheduleDDay',
        'scheduleAddress',
      ])
      .where('schedule.crewId = :id', { id: crewId })
      .getRawMany();
    return schedule;
  }
}