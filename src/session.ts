import axios, { AxiosInstance } from "axios"

export type SessionOptions = {
    baseUrl: string,
    apiKey: string    
}

export default class Session {

    private inst: AxiosInstance;

    constructor(private opts: SessionOptions) {
        this.inst = axios.create({
            baseURL: opts.baseUrl,
            headers: {
                'API-KEY': opts.apiKey
            }
        });
    }

    get(url: string): Promise<any> {
        return this.inst.get(url);
    }
}