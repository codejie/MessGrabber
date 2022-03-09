
export type FilterOptions = {
    [key: string]: {} | FilterOptions
};

export class Grapper {
    protected filters!: string[]

    constructor(protected request: Request) {
        this.initFilters();
    }

    protected scan(opts: FilterOptions, mode: string = 'or'): string {
        let ret: string = '(';
        Object.keys(opts).forEach(item => {
            if (item === 'or') {
                ret += this.scan(opts[item], 'or');
            } else if (item === 'and') {
                ret += this.scan(opts[item], 'and')
            } else {
                if (!this.check(item)) {
                    throw new Error(`${item} is NOT legal filter.`);
                }
                
                if (mode === 'and') {
                    ret += `+${item}:${opts[item]}`;
                } else {
                    ret += `${item}:${opts[item]}`;
                }
            }
        });
        ret += ')';
    }


}