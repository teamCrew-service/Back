import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditNoticeDto {
  // noticeTitle
  @ApiProperty({
    example: '일산 호수공원 런닝!!',
    description: 'noticeTitle',
    required: true,
  })
  @IsString()
  @IsOptional()
  noticeTitle: string;

  // noticeContent
  @ApiProperty({
    example:
      '일산 호수공원 저녁 8시에 런닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
    description: 'noticeContent',
    required: true,
  })
  @IsString()
  @IsOptional()
  noticeContent: string;

  // noticeAddress
  @ApiProperty({
    example: '일산 호수공원',
    description: 'noticeAddress',
    required: true,
  })
  @IsString()
  @IsOptional()
  noticeAddress: string;

  // noticeDDay
  @ApiProperty({
    example: '2023-08-19T03:44:19.661Z',
    description: 'noticeDDay',
    required: true,
  })
  @IsDate()
  @IsOptional()
  noticeDDay: Date;
}
