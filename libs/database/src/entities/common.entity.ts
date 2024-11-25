import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class CommonEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
