import { Injectable } from '@nestjs/common';
import { ParticipantRepository } from './participant.repository';

@Injectable()
export class ParticipantService {
  constructor(private readonly participantRepository: ParticipantRepository) {}

  /* 일정에서 참여하기 */
  async participateSchedule(
    userId: number,
    crewId: number,
    scheduleId: number,
  ): Promise<any> {
    const participant = await this.participantRepository.participateSchedule(
      userId,
      crewId,
      scheduleId,
    );
    return participant;
  }

  /* schedule에 참여한 인원 조회하기 */
  async findAllParticipant(crewId: number, scheduleId: number): Promise<any> {
    const participant = await this.participantRepository.findAllParticipant(
      crewId,
      scheduleId,
    );
    return participant;
  }

  /* 참여한 schedule 취소하기 */
  async cancelParticipate(
    crewId: number,
    scheduleId: number,
    userId: number,
  ): Promise<any> {
    const canceledParticipant =
      await this.participantRepository.cancelParticipate(
        crewId,
        scheduleId,
        userId,
      );
    return canceledParticipant;
  }
}
