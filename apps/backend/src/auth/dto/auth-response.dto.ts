import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ nullable: true }) email: string | null;
  @ApiProperty() name: string;
  @ApiProperty() role: string;
  @ApiProperty() isGuest: boolean;
  @ApiProperty() theme: string;
}

export class AuthResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty({ type: UserResponseDto }) user: UserResponseDto;
}
