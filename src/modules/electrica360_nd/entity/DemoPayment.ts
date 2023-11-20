import {
    OneToMany,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column, AfterLoad
} from 'typeorm';
import DemoCustomer from './DemoCustomer';

@Entity({ name: 'tdemo_payment', schema: 'public' })
export default class DemoPayment extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'id_demo_payment' })
    demoPaymentId: number;

    @Column({ name: 'id_demo_customer' })
    demoCustomerId: number;

    @Column({ name: 'amount', type: 'numeric' })
    amount: number;

    @Column({ name: 'month', type: 'int' })
    month: string;

    @Column({ name: 'status', type: 'varchar', length: 100 })
    status: string;

    @ManyToOne(() => DemoCustomer, demoCustomer => demoCustomer.DemoPayment)
    @JoinColumn({ name: 'id_demo_customer' })
    demoCustomer: DemoCustomer;

}
