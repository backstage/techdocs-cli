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
import { resolve } from "path";
import { Command } from "commander";
import { createLogger } from "../../lib/utility";
import { ConfigReader } from "@backstage/config";
import { SingleHostDiscovery } from "@backstage/backend-common";
import { Publisher } from "@backstage/techdocs-common";
import { Entity } from "@backstage/catalog-model";

export default async function publish(cmd: Command) {
  const logger = createLogger({ verbose: cmd.verbose });

  // Assuming that proper credentials are set in Environment variables
  // for the respective GCS/AWS clients to work.

  if (
    !["awsS3", "googleGcs", "azureBlobStorage", "openStackSwift"].includes(
      cmd.publisherType
    )
  ) {
    logger.error(`Unknown publisher type ${cmd.publisherType}`);
    throw new Error();
  }

  let publisherConfig;
  if ("azureBlobStorage" === cmd.publisherType) {
    if (!cmd.azureAccountName) {
      logger.error(
        `azureBlobStorage requires --azureAccountName to be specified`
      );
      throw new Error();
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
  } else if ("awsS3" === cmd.publisherType) {
    publisherConfig = {
      type: cmd.publisherType,
      [cmd.publisherType]: {
        bucketName: cmd.storageName,
        ...(cmd.awsRoleArn && { credentials: { roleArn: cmd.awsRoleArn } }),
        ...(cmd.awsEndpoint && { endpoint: cmd.awsEndpoint }),
        ...(cmd.awsS3ForcePathStyle && { s3ForcePathStyle: true })
      }
    };
  } else if ("openStackSwift" === cmd.publisherType) {
    let ismissingVariable = false;

    ["osUsername", "osPassword", "osAuthUrl", "osRegion"].forEach(
      (param: string) => {
        if (!cmd[param]) {
          ismissingVariable = true;
          logger.error(`openStackSwift requires --${param} to be specified`);
        }
      }
    );

    if (ismissingVariable) {
      throw new Error();
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

  const config = new ConfigReader({
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

  const discovery = SingleHostDiscovery.fromConfig(config);
  const publisher = await Publisher.fromConfig(config, { logger, discovery });

  // Check that the publisher's underlying storage is ready and available.
  const { isAvailable } = await publisher.getReadiness();
  if (!isAvailable) {
    // Error messages printed in getReadiness() call. This ensures exit code 1.
    return Promise.reject(new Error(""));
  }

  const [namespace, kind, name] = cmd.entity.split("/");
  const entity = {
    kind,
    metadata: {
      namespace,
      name
    }
  } as Entity;

  const directory = resolve(cmd.directory);
  await publisher.publish({ entity, directory });
}
