import { Grapper, Request, Response } from ".";

export interface HostSearchRequest extends Request {
    
}

export class HostSearchGrapper extends Grapper {

    protected makeQueryUri<Req extends Request>(req: Req): string {
        throw new Error("Method not implemented.");
    }
    protected postRequest(uri: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    protected analyseResponse<Resp extends Response>(resp: any): Resp {
        throw new Error("Method not implemented.");
    }

}