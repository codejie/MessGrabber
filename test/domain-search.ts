import fs, { write, WriteStream } from 'fs';
import Session from '../src/session';
import { DomainInfoStruct, DomainSearchGrapper, DomainSearchRequest, DomainSearchResponse } from '../src/grapper/domain-search-grapper';

export async function domainOutput(session: Session): Promise<void> {

    let result: DomainInfoStruct[] = [];
    // let facets: FacetStruct[];

    const grapper = new DomainSearchGrapper(session);

    for (let page = 1; page < 3; ++ page) {
        const ret = await grapper.request(<DomainSearchRequest>{
            page: 1,
            host: 'huawei.com'
        });

        result.push(...(<DomainSearchResponse>ret).domains);
    }

    const domain = fs.createWriteStream('./output/domain-output.csv');

    writeln(domain, ['Sub Domains']);
    writeln(domain, ['site', 'ip']);
    result.forEach(item => {
        writeln(domain, [item.name, item.ip.join('|')]); 
    });

    writeln(domain,[]);
    writeln(domain,[])
    writeln(domain,[])

    result = [];

    for (let page = 1; page < 3; ++ page) {
        const ret = await grapper.request(<DomainSearchRequest>{
            page: 1,
            host: 'huawei.com',
            sub: true
        });

        result.push(...(<DomainSearchResponse>ret).domains);
    }

    writeln(domain, ['Related Domains']);    
    writeln(domain, ['site', 'ip']);
    result.forEach(item => {
        writeln(domain, [item.name, item.ip.join('|')]); 
    });

    domain.close();

}

function writeln(output: WriteStream, data: any[]): void {
    output.write(data.join(','));
    output.write('\n');
}
