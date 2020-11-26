/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 
 import { createApiFactory, configApiRef } from '@backstage/core';

import {
    techdocsStorageApiRef,
    TechDocsStorage,
    techdocsApiRef,
    TechDocs,
} from "@backstage/plugin-techdocs";
// TODO: Export type from plugin-techdocs and import this here
// import { ParsedEntityId } from '@backstage/plugin-techdocs'

class TechDocsDevStorageApi implements TechDocsStorage {
  public apiOrigin: string;

  constructor({ apiOrigin }: { apiOrigin: string }) {
    this.apiOrigin = apiOrigin;
  }

  async getEntityDocs(
    entityId: any /*ParsedEntityType from plugin-techdocs/types*/,
    path: string
  ) {
    const url = `${this.apiOrigin}/${path}`;

    const request = await fetch(
      `${url.endsWith("/") ? url : `${url}/`}index.html`
    );

    if (request.status === 404) {
      throw new Error("Page not found");
    }

    return request.text();
  }

  getBaseUrl(
    oldBaseUrl: string,
    entityId: any /*ParsedEntityType from plugin-techdocs/types*/,
    path: string
  ): string {
    const { name } = entityId;
    return new URL(oldBaseUrl, `${this.apiOrigin}/${name}/${path}`).toString();
  }
}

class TechDocsDevApi implements TechDocs {
    public apiOrigin: string;

    constructor({ apiOrigin }: { apiOrigin: string }) {
      this.apiOrigin = apiOrigin;
    }
  
    async getMetadata(metadataType: string, entityId: any) {
      return "";
    }  
}

export const apis = [
    createApiFactory({
        api: techdocsStorageApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => 
        new TechDocsDevStorageApi({
            apiOrigin: configApi.getString('techdocs.requestUrl'),
        }),
    }),
    createApiFactory({
        api: techdocsApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => 
        new TechDocsDevApi({
            apiOrigin: configApi.getString('techdocs.requestUrl'),
        }),
    }),
];
