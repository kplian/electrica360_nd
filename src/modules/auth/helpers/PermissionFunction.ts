import { EntityManager, getManager } from 'typeorm';

import {
    entities
} from '@pxp-nd/common';

const userHasPermission = async (user: any, transaction: string): Promise<boolean> => {
    if (user.type == 'pxp-nd') {
        if (user.roleIds.includes(1)) {
            return true;
        } else {
            return await checkTransaction(user.roleIds, transaction);
        }
    } else if (user.type == 'pxp-old') {
        return true;
    } else {
        return false;
    }
   
 
 };
 const checkTransaction = async (roleIds: any, transaction: string): Promise<boolean> => {
    const transactionWithRoles = await getManager()
    .createQueryBuilder(entities.Transaction, 'transaction')
    .innerJoin('transaction.roles', 'role')
    .where('role.roleId IN (:...roleIds)', { roleIds: roleIds as number[] })
    .andWhere('transaction.code = :transaction', { transaction })
    .getOne();

    if (transactionWithRoles) {
        return true
    } 

    return false;
 
 };

 export default userHasPermission;