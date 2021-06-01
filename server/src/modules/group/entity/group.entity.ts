import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  groupId: string;

  @Column()
  userId: string;

  @Column()
  groupName: string;

  @Column({
    default: 'The group owner is very lazy and did not write an announcement'
  })
  notice: string;

  @Column({ type: 'double', default: new Date().valueOf() })
  createTime: number;
}

@Entity()
export class GroupMap {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  groupId: string;

  @Column()
  userId: string;

  @Column({
    type: 'double',
    default: new Date().valueOf(),
    comment: '进群时间',
  })
  createTime: number;
}
