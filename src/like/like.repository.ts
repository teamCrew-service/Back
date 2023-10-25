import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  /* 찜하기 */
  async likeCrew(crewId: number, userId: number): Promise<any> {
    const like = new Like();
    like.crewId = crewId;
    like.userId = userId;
    await this.likeRepository.save(like);
    return like;
  }

  /* 찜 취소하기 */
  async cancelLikeCrew(crewId: number, userId: number): Promise<any> {
    const caceledLike = await this.likeRepository
      .createQueryBuilder('like')
      .delete()
      .from(Like)
      .where('like.crewId = :crewId', { crewId })
      .andWhere('like.userId = :userId', { userId })
      .execute();
    return caceledLike;
  }

  /* 찜 조회하기 */
  async findLikedCrew(userId: number): Promise<any> {
    const likedCrew = await this.likeRepository
      .createQueryBuilder('like')
      .leftJoin('crew', 'crew', 'crew.crewId = like.crewId')
      .leftJoin('member', 'member', 'member.crewId = like.crewId')
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
      .where('like.userId = :userId', { userId })
      .andWhere('crew.deletedAt IS NULL')
      .orderBy('crew.createdAt', 'DESC')
      .groupBy('like.likeId')
      .getRawMany();
    return likedCrew;
  }

  /* crew를 찜한 횟수 확인 */
  async countLikedCrew(crewId: number): Promise<any> {
    const likedCrew = await this.likeRepository
      .createQueryBuilder('like')
      .select(['likeId', 'crewId'])
      .where('like.crewId = :crewId', { crewId })
      .getRawMany();
    return likedCrew;
  }

  /* user가 crew를 찜했는지 확인하기 */
  async confirmLiked(crewId: number, userId: number): Promise<any> {
    const like = await this.likeRepository
      .createQueryBuilder('like')
      .select(['likeId', 'crewId', 'userId'])
      .where('like.crewId = :crewId', { crewId })
      .andWhere('like.userId = :userId', { userId })
      .getRawOne();

    return like;
  }

  /* 좋아요 삭제 */
  async deleteLike(crewId: number): Promise<any> {
    const deleteLike = await this.likeRepository
      .createQueryBuilder('like')
      .delete()
      .from(Like)
      .where('crewId = :crewId', { crewId })
      .execute();

    return deleteLike;
  }
}
