/// <reference types="node" />
import http from 'http';
export default class HTTPServer {
    dir: string;
    port: number;
    proxyEndpoint: string;
    constructor(dir: string, port: number);
    private createProxy;
    serve(): Promise<http.Server>;
}
