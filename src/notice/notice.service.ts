import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { EditNoticeDto } from './dto/editNotice.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  @Cron('0 0 * * * *') // cron을 이용해 scheduling
  // method가 자정에 맞춰 계속 noticeIsDone 부분을 scheduling
  async noticeCron() {
    await this.noticeRepository.updateNoticeIsDone();
  }

  /* 공지 등록 */
  async createNotice(
    userId: number,
    crewId: number,
    createNoticeDto: CreateNoticeDto,
  ): Promise<any> {
    const notice = await this.noticeRepository.createNotice(
      userId,
      crewId,
      createNoticeDto,
    );
    return notice;
  }

  /* 공지 전체 조회 */
  async findAllNotice(crewId: number): Promise<any> {
    const notice = await this.noticeRepository.findAllNotice(crewId);
    return notice;
  }

  /* 공지 상세 조회 */
  async findNoticeDetail(crewId: number, noticeId: number): Promise<any> {
    const notice = await this.noticeRepository.findNoticeDetail(
      crewId,
      noticeId,
    );
    return notice;
  }

  /* 공지 수정 */
  async editNotice(
    crewId: number,
    noticeId: number,
    editNoticeDto: EditNoticeDto,
  ): Promise<any> {
    const editNotice = await this.noticeRepository.editNotice(
      crewId,
      noticeId,
      editNoticeDto,
    );
    return editNotice;
  }

  /* 공지 삭제 */
  async deleteNotice(crewId: number, noticeId: number): Promise<any> {
    const deletedNotice = await this.noticeRepository.deleteNotice(
      crewId,
      noticeId,
    );
    return deletedNotice;
  }

  /* 위임에 따라 완료되지 않은 공지 userId를 위임자 userId로 수정 */
  async delegateNotice(delegator: number, crewId: number): Promise<any> {
    await this.noticeRepository.delegateNotice(delegator, crewId);
    return '공지 위임 완료';
  }

  /* crew 삭제에 따른 notice 삭제 */
  async deleteNoticeByCrew(crewId: number): Promise<any> {
    const deleteNotice = await this.noticeRepository.deleteNoticeByCrew(crewId);
    return deleteNotice;
  }
}
