import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
// import Address from '../address/address.entity';
// import Post from '../post/post.entity';

@Entity('t_nf_log_error')
class LogErr {
    @PrimaryGeneratedColumn({type: "bigint"})
    public err_seq?: bigint;

    @Column(`varchar`, {length: 10})
    public status_code: string;

    @Column(`varchar`, {length: 10})
    public server: string;

    @Column(`varchar`, {length: 100})
    public id: string;

    @Column(`varchar`, {length: 100})
    public method: string;

    @Column(`varchar`, {length: 100})
    public path: string;

    @Column(`text`)
    public header: string;

    @Column(`text`)
    public params: string;

    @Column(`text`)
    public query: string;

    @Column(`text`)
    public payload: string;

    @Column(`text`)
    public response: string;

    @Column('datetime')
    public reg_date: Date;

}

export default LogErr;
