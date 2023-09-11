import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

  /* (누구나 참여 가능) 모임 가입 */
  async signup(crewId: number, userId: number): Promise<any> {
    const signup = await this.memberRepository.addMember(crewId, userId);
    return signup;
  }

  /* member 조회 */
  async findAllMember(crewId: number): Promise<any> {
    const allMember = await this.memberRepository.findAllMember(crewId);
    const member = allMember.map((user) => user.userId);
    return member;
  }
}
