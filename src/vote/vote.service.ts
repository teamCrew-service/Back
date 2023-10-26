import { Injectable } from '@nestjs/common';
import { VoteRepository } from './vote.repository';
import { VotingDto } from './dto/voting.dto';
import { EditVotingDto } from './dto/editVoting.dto';

@Injectable()
export class VoteService {
  constructor(private readonly voteRepository: VoteRepository) {}

  /* 투표하기 */
  async voting(
    userId: number,
    crewId: number,
    voteFormId: number,
    votingDto: VotingDto,
  ): Promise<any> {
    const vote = await this.voteRepository.voting(
      userId,
      crewId,
      voteFormId,
      votingDto,
    );
    return vote;
  }

  /* 투표 확인하기 */
  async findAllVote(crewId: number, voteFormId: number): Promise<any> {
    const vote = await this.voteRepository.findAllVote(crewId, voteFormId);
    return vote;
  }

  /* 익명 투표 확인하기 */
  async findAllAnonymousVote(crewId: number, voteFormId: number): Promise<any> {
    const vote = await this.voteRepository.findAllAnonymousVote(
      crewId,
      voteFormId,
    );
    return vote;
  }

  /* 투표 수정하기 */
  async editVote(
    userId: number,
    crewId: number,
    voteFormId: number,
    editVotingDto: EditVotingDto,
  ): Promise<any> {
    const editedVote = await this.voteRepository.editVote(
      userId,
      crewId,
      voteFormId,
      editVotingDto,
    );
    return editedVote;
  }

  /* crew 삭제에 따라 투표 삭제하기 */
  async deleteVoteByCrew(crewId: number): Promise<any> {
    const deleteVote = await this.voteRepository.deleteVoteByCrew(crewId);
    return deleteVote;
  }
}
