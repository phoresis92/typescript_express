import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
// import Address from '../address/address.entity';
// import Post from '../post/post.entity';

@Entity('t_nf_log_error')
class LogErr {
  @PrimaryGeneratedColumn()
  public err_seq?: bigint;

  @Column()
  public status_code: string;

  @Column()
  public server: string;

  @Column()
  public id: string;

  @Column()
  public method: string;

  @Column()
  public path: string;

  @Column()
  public header: string;

  @Column()
  public params: string;

  @Column()
  public query: string;

  @Column()
  public payload: string;

  @Column()
  public response: string;

  @Column('datetime')
  public reg_date: Date;

}

export default LogErr;
