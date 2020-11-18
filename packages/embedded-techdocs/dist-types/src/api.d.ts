import { TechDocsStorage } from "@backstage/plugin-techdocs";
export declare class TechDocsDevStorageApi implements TechDocsStorage {
    apiOrigin: string;
    constructor({ apiOrigin }: {
        apiOrigin: string;
    });
    getEntityDocs(entityId: any, path: string): Promise<string>;
    getBaseUrl(oldBaseUrl: string, entityId: any, path: string): string;
}
