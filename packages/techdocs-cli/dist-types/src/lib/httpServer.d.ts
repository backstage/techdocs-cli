/// <reference types="node" />
import http from "http";
export default class HTTPServer {
    private readonly proxyEndpoint;
    private readonly backstageBundleDir;
    private readonly backstagePort;
    private readonly mkdocsPort;
    private readonly verbose;
    constructor(backstageBundleDir: string, backstagePort: number, mkdocsPort: number, verbose: boolean);
    private createProxy;
    serve(): Promise<http.Server>;
}
