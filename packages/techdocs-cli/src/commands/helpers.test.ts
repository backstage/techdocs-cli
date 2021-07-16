/*
 * Copyright 2021 The Backstage Authors
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

import { Command } from "commander";
import { getValidPublisherConfig, Publisher } from './helpers';

describe('getValidPublisherConfig', () => {
  it ("should not allow unknown publisher types", () => {
    const invalidConfig = {
      publisherType: "unknown publisher"       
    } as unknown as Command;

    expect(getValidPublisherConfig.bind(null, invalidConfig)).toThrow();
  })

  describe('for azureBlobStorage', () => {
    it('should require --azureAccountName', () => {
      const config = {
        publisherType: Publisher.azureBlobStorage,
      } as unknown as Command;
      expect(getValidPublisherConfig.bind(null, config)).toThrow();
    });

    it('should return valid ConfigReader', () => {
      const config = {
        publisherType: Publisher.azureBlobStorage,
        azureAccountName: 'someAccountName',
        storageName: 'someContainer',
      } as unknown as Command;

      const actualConfig = getValidPublisherConfig(config);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe(Publisher.azureBlobStorage);
      expect(actualConfig.getString(`techdocs.publisher.${Publisher.azureBlobStorage}.containerName`)).toBe('someContainer');
      expect(actualConfig.getString(`techdocs.publisher.${Publisher.azureBlobStorage}.credentials.accountName`)).toBe('someAccountName');
    });
  });

  describe('for awsS3', () => {
    it('should return valid ConfigReader', () => {
      const config = {
        publisherType: Publisher.awsS3,
        storageName: 'someStorageName',
      } as unknown as Command;

      const actualConfig = getValidPublisherConfig(config);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe(Publisher.awsS3);
      expect(actualConfig.getString(`techdocs.publisher.${Publisher.awsS3}.bucketName`)).toBe("someStorageName");
    });
  });

  describe('for openStackSwift', () => {
    it('should throw error on missing parameters', () => {
      const config = {
        publisherType: Publisher.openStackSwift,
        osUsername: 'someUsername',
        osPassword: 'somePassword',
      } as unknown as Command;
      expect(getValidPublisherConfig.bind(null, config)).toThrow();
    });
    
    it('should return valid ConfigReader', () => {
      const config = {
        publisherType: Publisher.openStackSwift,
        storageName: 'someStorageName',
        osUsername: 'someUsername',
        osPassword: 'somePassword',
        osAuthUrl: 'someAuthUrl',
        osRegion: 'someRegion',
      } as unknown as Command;

      const actualConfig = getValidPublisherConfig(config);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe(Publisher.openStackSwift);
      expect(actualConfig.getConfig(`techdocs.publisher.${Publisher.openStackSwift}`).get()).toMatchObject({
        containerName: 'someStorageName',
        credentials: {
          username: 'someUsername',
          password: 'somePassword'
        },
        authUrl: 'someAuthUrl',
        region: 'someRegion',
      });
    });
  });

  describe('for googleGcs', () => {
    it('should return valid ConfigReader', () => {
      const config = {
        publisherType: Publisher.googleGcs,
        storageName: 'someStorageName',
      } as unknown as Command;

      const actualConfig = getValidPublisherConfig(config);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe(Publisher.googleGcs);
      expect(actualConfig.getString(`techdocs.publisher.${Publisher.googleGcs}.bucketName`)).toBe("someStorageName");
    });
  });
});
