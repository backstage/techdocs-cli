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
import { EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  configApiRef,
  createApiFactory,
  DiscoveryApi,
  discoveryApiRef,
} from '@backstage/core';
import {
  TechDocs,
  techdocsApiRef,
  TechDocsStorage,
  techdocsStorageApiRef,
} from '@backstage/plugin-techdocs';

// TODO: Export type from plugin-techdocs and import this here
// import { ParsedEntityId } from '@backstage/plugin-techdocs'

/**
 * Note: Override TechDocs API to use local mkdocs server instead of techdocs-backend.
 */

class TechDocsDevStorageApi implements TechDocsStorage {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  async getEntityDocs(_entityId: EntityName, path: string) {
    const apiOrigin = await this.getApiOrigin();
    // Irrespective of the entity, use mkdocs server to find the file for the path.
    const url = `${apiOrigin}/${path}`;

    const request = await fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
    );

    if (request.status === 404) {
      throw new Error('Page not found');
    }

    return request.text();
  }

  // Used by transformer to modify the request to assets (CSS, Image) from inside the HTML.
  async getBaseUrl(
    oldBaseUrl: string,
    _entityId: EntityName,
    path: string,
  ): Promise<string> {
    const apiOrigin = await this.getApiOrigin();
    return new URL(oldBaseUrl, `${apiOrigin}/${path}`).toString();
  }
}

class TechDocsDevApi implements TechDocs {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  // @ts-ignore
  async getEntityMetadata(_entityId: any) {
    return {
      spec: {
        owner: 'test',
        lifecycle: 'experimental',
      },
    };
  }

  async getTechDocsMetadata(_entityId: EntityName) {
    return {
      site_name: 'Live editing environment',
      site_description: '',
    };
  }
}

export const apis = [
  createApiFactory({
    api: techdocsStorageApiRef,
    deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
    factory: ({ configApi, discoveryApi }) =>
      new TechDocsDevStorageApi({
        configApi,
        discoveryApi,
      }),
  }),
  createApiFactory({
    api: techdocsApiRef,
    deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
    factory: ({ configApi, discoveryApi }) =>
      new TechDocsDevApi({
        configApi,
        discoveryApi,
      }),
  }),
];
