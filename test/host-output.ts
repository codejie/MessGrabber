import fs, { WriteStream } from 'fs';
import { FacetStruct, HostInfoStruct, HostSearchGrapper, HostSearchRequest, HostSearchResponse } from "../src/grapper/host-search-grapper";
import Session from '../src/session';

export async function hostOutput(session: Session): Promise<void> {

    const result: HostInfoStruct[] = [];
    let facets: FacetStruct[];

    const grapper = new HostSearchGrapper(session);
    for (let page = 1; page < 10; ++ page) {
        const ret = await grapper.request(<HostSearchRequest>{
            page: 1,
            filter: {
                app: 'huawei'
            },
            facets: ['app', 'device', 'service', 'country']
        });

        if (page == 1) {
            facets = (<HostSearchResponse>ret).factes!;
        }
        result.push(...(<HostSearchResponse>ret).infos);
    }
    const hostInfo = fs.createWriteStream('./output/host-output.csv');
    writeln(hostInfo, ['ip', 'rdns', 'app', 'organization', 'location', 'city', 'country']);
    result.forEach(item => {
        writeln(hostInfo, [item.ip, item.portInfo.rdns, item.portInfo.app, item.geoInfo.organization.replace(',',' '),
            `${item.geoInfo.location.lat}:${item.geoInfo.location.lon}`, item.geoInfo.city.names['zh-CN'],
            item.geoInfo.country.names['zh-CN']]); 
    });
    hostInfo.close();

    const stat = fs.createWriteStream('./output/host-stat.csv');
    facets!.forEach(item => {
        writeln(stat, [item.name]);
        writeln(stat, ['Key', 'Count']);
        item.data.forEach(i => {
            writeln(stat, [i.name, i.count]);
        });
        writeln(stat, []);
        writeln(stat, []);
    });

    stat.close();

}

function writeln(output: WriteStream, data: any[]): void {
    output.write(data.join(','));
    output.write('\n');
}
