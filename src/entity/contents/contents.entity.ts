import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from '../category/category.entity';
import User from '../user/user.entity';

enum contentsType {
  NOTICE = "NOTICE",
  CONTENTS = "CONTENTS"
}

@Entity('t_nf_contents')
class Contents {
  @PrimaryGeneratedColumn({type:"bigint"})
  public contents_seq?: bigint;

  @Column(`varchar`, {length: 200})
  public serial_number: string;

  @Column({
    type: "enum",
    enum: contentsType,
    default: contentsType.CONTENTS
          })
  public contents_type;

  @Column(`varchar`, {length: 1000})
  public contents: string;

  @Column(`varchar`, {length: 50})
  public phone_number: string;

  @Column('datetime')
  public reg_date: Date;

}

export default Contents;
