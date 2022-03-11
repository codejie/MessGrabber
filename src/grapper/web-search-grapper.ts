import { FilterOptions, Grapper, Request, Response } from ".";
import Session from "../session";

export interface WebSearchRequest extends Request {
    filter: FilterOptions,
    facets?: string[]    
}

export interface WebInfoStruct {
    domains: any,
    site: string,
    title: string
    keywords: string,
    description: string,
    geoInfo: any,
    ip: string[],
    server: any[],
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

export interface WebSearchResponse extends Response {
    infos: WebInfoStruct[],
    factes?: FacetStruct[]
}

export class WebSearchGrapper extends Grapper {
    constructor(protected session: Session) {
        super(session);
    }

    protected initFilters(): string[] | undefined {
        return ['app', 'header', 'keywords', 'desc', 'title', 'ip', 'site',
                 'city', 'country'];
    }

    protected initFacets(): string[] | undefined{
        return ['webapp', 'component', 'framework', 'frontend', 'server', 'waf',
                'os', 'country', 'city'];
    }    

    protected makeQueryUri(req: WebSearchRequest): string {
        const ret = `/web/search?query=${this.scanFilterOptions(req.filter)}&page=${req.page}&facets=${this.scanFacetsOptions(req.facets)}`;
        return encodeURI(ret);
    }
    
    protected analyseResponse(req: WebSearchRequest, resp: any): WebSearchResponse {
        const infos: WebInfoStruct[] = [];
        (resp.data.matches as any[]).forEach(item => {
            infos.push({
                domains: item.domains,
                site: item.site,
                title: item.title,
                keywords: item.keywords,
                description: item.description,
                geoInfo: item.geoinfo,
                ip: item.ip,
                server: item.server,
                whois: item.whois,
                timestamp: new Date(item.timestamp)
            });
        });

        const factes: FacetStruct[] = [];
        if (resp.facets) {
            Object.keys(resp.facets).forEach(item => {
                factes.push({
                    name: item,
                    data: resp.facets[item]
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