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
import { ConfigReader } from "@backstage/config";
import { Command } from "commander";

export enum Publisher {
  awsS3 = "awsS3",
  googleGcs = "googleGcs",
  azureBlobStorage = "azureBlobStorage",
  openStackSwift = "openStackSwift",
}

type PublisherConfig = {
  type: Publisher;
  [Publisher.awsS3]?: any
  [Publisher.googleGcs]?: any
  [Publisher.azureBlobStorage]?: any
  [Publisher.openStackSwift]?: any
}

/**
 * Returns Backstage config suitable for use when instantiating a Publisher. If
 * there are any missing or invalid options provided, an error is thrown.
 */
export const getValidPublisherConfig = (cmd: Command): ConfigReader => {
  // Assuming that proper credentials are set in Environment variables
  // for the respective GCS/AWS clients to work.
  if (
    !Object.keys(Publisher).includes(
      cmd.publisherType
    )
  ) {
    throw new Error(`Unknown publisher type ${cmd.publisherType}`);
  }

  let publisherConfig: PublisherConfig;
  if (Publisher.azureBlobStorage === cmd.publisherType) {
    if (!cmd.azureAccountName) {
      throw new Error(`azureBlobStorage requires --azureAccountName to be specified`);
    }
    publisherConfig = {
      type: cmd.publisherType,
      [cmd.publisherType]: {
        containerName: cmd.storageName,
        credentials: {
          accountName: cmd.azureAccountName,
          accountKey: cmd.azureAccountKey
        }
      }
    };
  } else if (Publisher.awsS3 === cmd.publisherType) {
    publisherConfig = {
      type: cmd.publisherType,
      [cmd.publisherType]: {
        bucketName: cmd.storageName,
        ...(cmd.awsRoleArn && { credentials: { roleArn: cmd.awsRoleArn } }),
        ...(cmd.awsEndpoint && { endpoint: cmd.awsEndpoint }),
        ...(cmd.awsS3ForcePathStyle && { s3ForcePathStyle: true })
      }
    };
  } else if (Publisher.openStackSwift === cmd.publisherType) {
    const missingParams = ["osUsername", "osPassword", "osAuthUrl", "osRegion"].filter((param: string) => !cmd[param]);

    if (missingParams.length) {
      throw new Error(`openStackSwift requires the following params to be specified: ${missingParams.join(', ')}`);
    }

    publisherConfig = {
      type: cmd.publisherType,
      [cmd.publisherType]: {
        containerName: cmd.storageName,
        credentials: {
          username: cmd.osUsername,
          password: cmd.osPassword
        },
        authUrl: cmd.osAuthUrl,
        region: cmd.osRegion,
        keystoneAuthVersion: cmd.osAuthVersion,
        domainId: cmd.osDomainId,
        domainName: cmd.osDomainName
      }
    };
  } else {
    publisherConfig = {
      type: cmd.publisherType,
      [cmd.publisherType]: {
        bucketName: cmd.storageName
      }
    };
  }

  return new ConfigReader({
    // This backend config is not used at all. Just something needed a create a mock discovery instance.
    backend: {
      baseUrl: "http://localhost:7000",
      listen: {
        port: 7000
      }
    },
    techdocs: {
      publisher: publisherConfig
    }
  });
};
