
import {
    Controller, Log, Post, ReadOnly, Get, Permission
} from '@pxp-nd/core';
import moment from 'moment';
class Test extends Controller {

@Get()
@ReadOnly(true)
@Log(false)
@Permission(true)
    async  add(params: Record<string, unknown>): Promise<any> {
        return {success:true}

    }
}

export default Test;