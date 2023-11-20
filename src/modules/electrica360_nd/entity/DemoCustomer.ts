import {
    OneToMany,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column, AfterLoad
} from 'typeorm';

@Entity({ name: 'tdemo_customer', schema: 'public' })
export default class DemoCustomer extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'id_demo_customer' })
    demoCustomerId: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'ci', type: 'varchar', length: 100 })
    ci: string;

    @Column({ name: 'code', type: 'varchar', length: 100 })
    code: string;
}
