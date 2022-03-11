import { FilterOptions, Grapper, Request, Response } from ".";
import logger from "../logger";
import Session from "../session";

export interface DomainSearchRequest extends Request {
    host: string,
    sub?: boolean  
}

export interface DomainInfoStruct {
    name: string,
    ip: string[],
    timestamp: Date
}

export interface DomainSearchResponse extends Response {
    domains: DomainInfoStruct[]
}

export class DomainSearchGrapper extends Grapper {
    constructor(protected session: Session) {
        super(session);
    }


    protected makeQueryUri(req: DomainSearchRequest): string {
        const ret = `/domain/search?q=${req.host}&page=${req.page}&type=${req.sub ? '1' : '0'}`;
        return encodeURI(ret);
    }
    
    protected analyseResponse(req: DomainSearchRequest, resp: any): DomainSearchResponse {
        const infos: DomainInfoStruct[] = [];
        (resp.data.list as any[]).forEach(item => {
            infos.push({
                name: item.name,
                ip: item.ip,
                timestamp: new Date(item.timestamp)
            });
        });

        return {
            page: req.page,
            total: resp.data.total,
            domains: infos
        };
    }

}