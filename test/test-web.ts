import fs, { WriteStream } from 'fs';
import Session from '../src/session';
import logger from '../src/logger';
import { strEscape } from '../src/helper';
import { FacetStruct } from '../src/grabber/host-search-grabber';
import { WebInfoStruct, WebSearchGrabber, WebSearchRequest, WebSearchResponse } from '../src/grabber/web-search-grabber';


export async function testWebOutput(session: Session): Promise<void> {

    const result: WebInfoStruct[] = [];
    let facets: FacetStruct[];

    const grapper = new WebSearchGrabber(session);

    let page = 1;
    let total = 0;
    let count = 0;
    do {
        const ret = await grapper.request(<WebSearchRequest>{
            page: 1,
            filter: {
                keywords: '电力物联网',
                desc: '电力物联网',
                title: '电力物联网'
            },
            facets: [
                'city',
                'country'
            ]
        });

        result.push(...(<WebSearchResponse>ret).infos);
        total = ret.total;
        count += (<WebSearchResponse>ret).infos.length;

        if (page == 1) {
            facets = (<WebSearchResponse>ret).factes!;
        }

        logger.info(`get - page: ${page} count: ${count} total: ${total}`);

        ++ page;
    } while ((count < total) && (page < 10));

    const info = fs.createWriteStream('./output/test-output.csv');
    writeln(info, ['site', 'ip', 'isp', 'domains','keywords', 'description', 'location', 'city', 'country']);
    result.forEach(item => {
        writeln(info, [item.site, item.ip.join('|'), item.geoInfo.isp, item.domains.join('|'), strEscape(item.keywords), strEscape(item.description),
            `${item.geoInfo.location.lat}:${item.geoInfo.location.lon}`, item.geoInfo.city.names['zh-CN'],
            item.geoInfo.country.names['zh-CN']]); 
    });
    info.close();

    const stat = fs.createWriteStream('./output/test-stat.csv');
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
