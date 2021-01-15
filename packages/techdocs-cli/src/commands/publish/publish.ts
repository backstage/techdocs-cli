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

  const techdocsConfig = {
    type: "",
    googleGcs: {
      bucketName: ""
    },
    awsS3: {
      bucketName: ""
    }
  };
  switch (cmd.publisherType) {
    case "awsS3":
      techdocsConfig.type = "awsS3";
      techdocsConfig.awsS3.bucketName = cmd.storageName;
      break;
    case "googleGcs":
      techdocsConfig.type = "googleGcs";
      techdocsConfig.googleGcs.bucketName = cmd.storageName;
      break;
    default:
      logger.error(`Unknown publisher type ${cmd.publisherType}`);
      throw new Error();
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
      publisher: techdocsConfig
    }
  });

  const discovery = SingleHostDiscovery.fromConfig(config);
  const publisher = await Publisher.fromConfig(config, { logger, discovery });
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
