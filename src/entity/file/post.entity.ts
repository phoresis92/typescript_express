import { Column, Entity, JoinTable, OneToMany, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from '../category/category.entity';
import User from '../user/user.entity';

enum fileType {
    IMG = 'IMG',
    MOV = 'MOV',
}

@Entity('t_nf_file')
class Post {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    length: 20
  })
  public file_seq?: bigint;

  @Column({length: 20})
  public target_type: string;

  @Column({length: 50})
  public target_key: string;

  @Column({
            type: "enum",
            enum: fileType,
  })
  public file_type;

  @Column({
                            type: 'bigint',
                            length: 20
                          })
  public file_size?: bigint;

  @Column({length: 100})
  public file_path: string;

  @Column({length: 50})
  public file_name: string;

  @Column({length: 20})
  public file_extension: string;

  @Column({type: 'int', length: 11})
  public file_width: number;

  @Column({type: 'int', length: 11})
  public file_height: number;

  @Column({length: 100})
  public thumb_path: string;

  @Column({length: 50})
  public thumb_name: string;

  @Column({length: 20})
  public thumb_extension: string;

  @Column({type: 'int', length: 11})
  public thumb_width: number;

  @Column({type: 'int', length: 11})
  public thumb_heigth: number;

  @Column({length: 11})
  public file_width: number;


  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];
}

export default Post;
