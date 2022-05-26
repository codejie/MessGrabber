import { FilterOptions, Grabber, Request, Response } from ".";
import logger from "../logger";
import Session from "../session";

export interface HostSearchRequest extends Request {
    filter: FilterOptions,
    facets?: string[]    
}

export interface HostInfoStruct {
    geoInfo: any,
    ip: string,
    portInfo: any,
    whois: any,
    timestamp: Date
}

export interface FacetStruct {
    name: string,
    data: {
        name: string,
        count: number
    }[]
}

export interface HostSearchResponse extends Response {
    infos: HostInfoStruct[],
    factes?: FacetStruct[]
}

export class HostSearchGrabber extends Grabber {
    constructor(protected session: Session) {
        super(session);
    }

    protected initFilters(): string[] | undefined {
        return ['app', 'ver', 'device', 'os', 'service', 'ip', 'cidr',
                'hostname', 'port', 'city', 'country', 'asn'];
    }

    protected initFacets(): string[] | undefined{
        return ['app', 'device', 'service', 'os', 'port', 'country', 'city'];
    }      

    protected makeQueryUri(req: HostSearchRequest): string {
        const ret = `/host/search?query=${this.scanFilterOptions(req.filter)}&page=${req.page}&facets=${this.scanFacetsOptions(req.facets)}`;
        return encodeURI(ret);
    }
    
    protected analyseResponse(req: HostSearchRequest, resp: any): HostSearchResponse {
        const infos: HostInfoStruct[] = [];
        (resp.data.matches as any[]).forEach(item => {
            infos.push({
                geoInfo: item.geoinfo,
                ip: item.ip,
                portInfo: item.portinfo,
                whois: item.whois,
                timestamp: new Date(item.timestamp)
            });
        });

        const factes: FacetStruct[] = [];
        if (resp.data.facets) {
            Object.keys(resp.data.facets).forEach(item => {
                factes.push({
                    name: item,
                    data: resp.data.facets[item]
                });
            });
        }

        return {
            page: req.page,
            total: resp.data.total,
            infos: infos,
            factes: factes
        };
    }

}