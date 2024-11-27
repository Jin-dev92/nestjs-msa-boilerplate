import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@libs/database/entities';
import { UserRoleEnum } from '@libs/database/enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;
}
