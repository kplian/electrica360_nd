
import {
    Controller, Log, Post, ReadOnly, Get
} from '@pxp-nd/core';
class Test extends Controller {

@Get()
@ReadOnly(true)
@Log(false)
    async  add(params: Record<string, unknown>): Promise<any> {
        
        return { success:true };

    }
}

export default Test;