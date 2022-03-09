import Session from "../session";

export type FilterOptions = {
    [key: string]: {} | FilterOptions
};

export interface Request {
    // filter: FilterOptions,
    page?: number,
    // facets?: string[]
};

export interface Response {

}

export class Grapper {
    protected filters: string[]

    private levelCount: number = 0;

    constructor(protected session: Session) {
        this.filters = this.initFilters();
    }

    protected scan(opts: FilterOptions, mode: string = 'or'): string {
        ++ this.levelCount;

        let level = this.levelCount;
        let ret: string = '(';
        const keys = Object.keys(opts);
        for (let i = 0; i < keys.length; ++ i) {
            const item = keys[i];
            if (item === 'or' || item === 'and') {
                ret += this.scan(opts[item], item);
            } else {
                if (!this.check(item)) {
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

    protected check(item: string): boolean {
        return true;
        // return this.filters.indexOf(item) !== -1;
    }

    protected initFilters(): string[] {
        return [];
    }

    request<Req extends Request, Resp extends Response>(req: Req): Promise<Resp> {
        return new Promise<Resp>((resolve, reject) => {
            const uri = this.makeQueryUri(req);
            this.postRequest(uri)
                .then((resp: any) => {
                    const data = this.analyseResponse(resp);
                    resolve(data);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
}