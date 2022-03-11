import Session from "../session";

export type FilterOptions = {
    [key: string]: {} | FilterOptions
};

export interface Request {
    page: number
};

export interface Response {
    page: number,
    total: number
}

export abstract class Grapper {
    protected filters: string[] | undefined = undefined;
    protected facets: string[] | undefined = undefined;

    private levelCount: number = 0;

    constructor(protected session: Session) {
        this.filters = this.initFilters();
        this.facets = this.initFacets();
    }

    protected scanFilterOptions(opts: FilterOptions, mode: string = 'or'): string {
        ++ this.levelCount;

        let level = this.levelCount;
        let ret: string = '(';
        const keys = Object.keys(opts);
        for (let i = 0; i < keys.length; ++ i) {
            const item = keys[i];
            if (item === 'or' || item === 'and') {
                ret += this.scanFilterOptions(opts[item], item);
            } else {
                if (!this.checkFilter(item)) {
                    throw new Error(`'${item}' is NOT legal filter.`);
                }
                ret += `${item}:"${opts[item]}"`;
            }

            if ((level === this.levelCount) && (i !== keys.length - 1)) {
                if (mode === 'and') {
                    ret += '+';
                } else {
                    ret += ' ';
                }    
            }            
        }
        ret += ')';

        -- this.levelCount;

        return ret;
    }

    protected scanFacetsOptions(opts?: string[]): string {
        if (opts) {
            opts.forEach(item => {
                if (!this.checkFacte(item)) {
                    throw new Error(`'${item}' is NOT legal facte.`);
                }
            });
            return opts.join(',');
        }
        return '';
    }

    protected checkFilter(item: string): boolean {
        if (this.filters) {
            return this.filters.indexOf(item) !== -1;
        }
        return true;
    }

    protected checkFacte(item: string): boolean {
        if (this.facets) {
            return this.facets.indexOf(item) !== -1;
        }
        return true;
    }    

    protected initFilters(): string[] | undefined{
        return undefined;
    }

    protected initFacets(): string[] | undefined{
        return undefined;
    }    

    request(req: Request): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const uri: string = this.makeQueryUri(req);
            this.postRequest(uri)
                .then((resp: any) => {
                    const data: Response = this.analyseResponse(req, resp);
                    resolve(data);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    protected postRequest(uri: string): Promise<any> {
        return this.session.get(uri);
    }

    protected abstract makeQueryUri(req: Request): string;

    protected abstract analyseResponse(req: Request, resp: any): Response;
}