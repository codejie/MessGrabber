import fs, { WriteStream } from 'fs';
import Session from '../src/session';
import { strEscape } from '../src/helper';
import { WebInfoStruct, WebSearchGrabber, WebSearchRequest, WebSearchResponse } from '../src/grabber/web-search-grabber';

export async function webOutput(session: Session): Promise<void> {

    const result: WebInfoStruct[] = [];
    // let facets: FacetStruct[];

    const grapper = new WebSearchGrabber(session);
    for (let page = 1; page < 10; ++ page) {
        const ret = await grapper.request(<WebSearchRequest>{
            page: 1,
            filter: {
                keywords: '鸿蒙'
            }
        });

        result.push(...(<WebSearchResponse>ret).infos);
    }

    const info = fs.createWriteStream('./output/web-output.csv');
    writeln(info, ['site', 'ip', 'isp', 'domains','keywords', 'description', 'location', 'city', 'country']);
    result.forEach(item => {
        writeln(info, [item.site, item.ip.join('|'), item.geoInfo.isp, item.domains.join('|'), strEscape(item.keywords), strEscape(item.description),
            `${item.geoInfo.location.lat}:${item.geoInfo.location.lon}`, item.geoInfo.city.names['zh-CN'],
            item.geoInfo.country.names['zh-CN']]); 
    });
    info.close();

}

function writeln(output: WriteStream, data: any[]): void {
    output.write(data.join(','));
    output.write('\n');
}
