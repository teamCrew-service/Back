import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crew } from './entities/crew.entity';
import { Repository } from 'typeorm';
import { CreateCrewDto } from './dto/createCrew.dto';
import { EditCrewDto } from './dto/editCrew.dto';

@Injectable()
export class CrewRepository {
  constructor(
    @InjectRepository(Crew) private crewRepository: Repository<Crew>,
  ) {}

  /* 권한 검사를 위한 crew 조회 */
  async findCrewForAuth(crewId: number): Promise<any> {
    const crew = await this.crewRepository
      .createQueryBuilder('crew')
      .select(['userId'])
      .where('crew.crewId = :id', { id: crewId })
      .getRawOne();
    return crew;
  }

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<any> {
    const crewList = await this.crewRepository.find({ where: { category } });
    return crewList;
  }

  /* 모임 생성 */
  async createCrew(createCrewDto: CreateCrewDto, userId: number): Promise<any> {
    const crew = new Crew();
    crew.userId = userId;
    if (createCrewDto.category.includes('%2F') === true) {
      const category = createCrewDto.category.replace('%2F', '/');
      crew.category = category;
    } else {
      crew.category = createCrewDto.category;
    }
    crew.crewAddress = createCrewDto.crewAddress;
    crew.crewType = createCrewDto.crewType;
    crew.crewDDay = createCrewDto.crewDDay;
    crew.crewMemberInfo = createCrewDto.crewMemberInfo;
    crew.crewTimeInfo = createCrewDto.crewTimeInfo;
    crew.crewTitle = createCrewDto.crewTitle;
    crew.crewContent = createCrewDto.crewContent;
    crew.crewAgeInfo = createCrewDto.crewAgeInfo;
    crew.crewSignup = createCrewDto.crewSignup;
    crew.thumbnail = createCrewDto.thumbnail;
    crew.crewMaxMember = createCrewDto.crewMaxMember;
    crew.latitude = createCrewDto.crewLatitude;
    crew.longtitude = createCrewDto.crewLongtitude;
    await this.crewRepository.save(crew);
    return crew;
  }

  /* 모임 글 상세 조회 */
  async findCrewDetail(crewId: number): Promise<any> {
    const crew = await this.crewRepository
      .createQueryBuilder('crew')
      .select([
        'crew.crewId',
        'crew.userId AS captainId',
        'users.age AS captainAge',
        'users.location AS captainLocation',
        'users.myMessage AS captainMessage',
        'users.nickname AS captainNickname',
        'users.profileImage AS captainProfileImage',
        'crew.category',
        'crew.crewAddress',
        'crew.crewType',
        'crew.crewDDay',
        'crew.crewMemberInfo',
        'crew.crewAgeInfo',
        'crew.crewSignup',
        'crew.crewTitle',
        'crew.crewContent',
        'crew.thumbnail',
        'crew.crewMaxMember',
        'COUNT(member.crewId) AS crewAttendedMember',
        'crew.latitude',
        'crew.longtitude',
        'crew.createdAt',
        'crew.deletedAt',
        'signupform.signupFormId AS signupFormId',
      ])
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .leftJoin('users', 'users', 'users.userId = crew.userId')
      .leftJoin('topic', 'topic', 'topic.userId = crew.userId')
      .leftJoin('signupform', 'signupform', 'signupform.crewId = crew.crewId')
      .where('crew.crewId = :crewId', { crewId })
      .getRawOne();

    return crew;
  }

  async findCreatedCrew(userId: number): Promise<any> {
    const createdCrew = await this.crewRepository
      .createQueryBuilder('crew')
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .select([
        'crew.crewId',
        'crew.category',
        'crew.crewType',
        'crew.crewAddress',
        'crew.crewTitle',
        'crew.crewContent',
        'crew.crewMaxMember',
        'COUNT(member.crewId) AS crewAttendedMember',
        'crew.thumbnail',
      ])
      .where('crew.userId = :userId', { userId })
      .andWhere('crew.deletedAt IS NULL')
      .orderBy('crew.createdAt', 'DESC')
      .groupBy('crew.crewId')
      .getRawMany();
    return createdCrew;
  }

  /* 모임 글 수정 */
  //TODO : 수정할 때, 삭제되었는지 확인하는 로직 필요할듯
  async editCrew(crewId: number, editCrewDto: EditCrewDto): Promise<any> {
    const {
      category,
      crewAddress,
      crewMemberInfo,
      crewTimeInfo,
      crewAgeInfo,
      crewSignup,
      crewTitle,
      crewContent,
      crewMaxMember,
    } = editCrewDto;

    const editCrew = await this.crewRepository.update(
      { crewId },
      {
        category,
        crewAddress,
        crewMemberInfo,
        crewTimeInfo,
        crewAgeInfo,
        crewSignup,
        crewTitle,
        crewContent,
        crewMaxMember,
        updatedAt: new Date(),
      },
    );

    return editCrew;
  }

  /* 모임 글 삭제 */
  async deleteCrew(crewId: number): Promise<any> {
    const deleteCrew = await this.crewRepository.update(
      { crewId },
      { deletedAt: new Date() },
    );
    return deleteCrew;
  }

  /* crewId로 조회하기 */
  async findByCrewId(crewId: number): Promise<any> {
    const crew = await this.crewRepository
      .createQueryBuilder('crew')
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .select([
        'crew.crewId AS crewId',
        'crew.userId AS userId',
        'crew.category AS category',
        'crew.crewType AS crewType',
        'crew.crewAddress AS crewAddress',
        'crew.crewDDay AS crewDDay',
        'crew.crewTitle AS crewTitle',
        'crew.crewContent AS crewContent',
        'crew.crewMaxMember AS crewMaxMember',
        'COUNT(member.crewId) AS crewAttendedMember',
        'crew.thumbnail AS thumbnail',
      ])
      .where('crew.crewId = :crewId', { crewId })
      .andWhere('crew.deletedAt IS NULL')
      .orderBy('crew.createdAt', 'DESC')
      .getRawOne();
    return crew;
  }

  /* 대기중인 모임을 위한 조회 */
  async findWaitingPermission(crewId: number): Promise<any> {
    const crew = await this.crewRepository
      .createQueryBuilder('crew')
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .select([
        'crew.crewId',
        'crew.userId',
        'crew.category',
        'crew.crewType',
        'crew.crewAddress',
        'crew.crewTitle',
        'crew.crewContent',
        'crew.crewMaxMember',
        'COUNT(member.crewId) AS crewAttendedMember',
        'crew.thumbnail',
      ])
      .where('crew.crewId = :crewId', { crewId })
      .andWhere('crew.deletedAt IS NULL')
      .orderBy('crew.createdAt', 'DESC')
      .getRawOne();
    return crew;
  }

  /* userId를 이용해 내가 생성한 모임 조회하기 */
  async findMyCrew(userId: number): Promise<any> {
    const myCrew = await this.crewRepository
      .createQueryBuilder('crew')
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .leftJoin(
        'signup',
        'signup',
        'signup.crewId = crew.crewId AND signup.permission IS NULL',
      )
      .select([
        'crew.crewId',
        'crew.category',
        'crew.crewType',
        'crew.crewAddress',
        'crew.crewDDay',
        'crew.crewTitle',
        'crew.crewContent',
        'crew.crewMaxMember',
        'COUNT(member.crewId) AS crewAttendedMember',
        'crew.thumbnail',
        'CASE WHEN COUNT(signup.crewId) > 0 THEN TRUE ELSE FALSE END AS existSignup',
      ])
      .where('crew.userId = :userId', { userId })
      .andWhere('crew.deletedAt IS NULL')
      .orderBy('crew.createdAt', 'DESC')
      .groupBy('crew.crewId')
      .getRawMany();
    return myCrew;
  }

  /* crewId로 Detail하게 조회하기 */
  async findCrewDetailByCrewId(crewId: number): Promise<any> {
    const crew = await this.crewRepository
      .createQueryBuilder('crew')
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .select([
        'crew.crewId',
        'crew.category',
        'crew.crewType',
        'crew.crewAddress',
        'crew.crewTitle',
        'crew.crewContent',
        'crew.crewDDay',
        'crew.crewMaxMember',
        'COUNT(member.crewId) AS crewAttendedMember',
        'crew.thumbnail',
      ])
      .where('crew.crewId = :crewId', { crewId })
      .andWhere('crew.deletedAt IS NULL')
      .orderBy('crew.createdAt', 'DESC')
      .groupBy('crew.crewId')
      .getRawOne();

    return crew;
  }

  /* myCrew를 하나만 조회하기 */
  async findOneCrew(crewId: number, userId: number): Promise<any> {
    const crew = await this.crewRepository
      .createQueryBuilder('crew')
      .where('crew.crewId = :crewId', { crewId })
      .andWhere('crew.userId = :userId', { userId })
      .select(['crewId', 'userId'])
      .getRawOne();

    return crew;
  }

  /* 모임장 위임하기 */
  async delegateCrew(
    delegator: number,
    crewId: number,
    userId: number,
  ): Promise<any> {
    const delegateCrew = await this.crewRepository
      .createQueryBuilder()
      .update('crew')
      .set({ userId: delegator })
      .where('crew.crewId = :crewId', { crewId })
      .andWhere('crew.userId = :userId', { userId })
      .execute();
    return delegateCrew;
  }

  /* Thumbnail 수정하기 */
  async editThumbnail(crewId: number, thumbnail: string): Promise<any> {
    const crew = await this.crewRepository.update(
      { crewId },
      { thumbnail: thumbnail },
    );
    return crew;
  }
}
