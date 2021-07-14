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

import { CommanderStatic } from "commander";

export function registerCommands(program: CommanderStatic) {
  program
    .command("generate")
    .description("Generate TechDocs documentation site using MkDocs.")
    .option(
      "--source-dir <PATH>",
      "Source directory containing mkdocs.yml and docs/ directory.",
      "."
    )
    .option(
      "--output-dir <PATH>",
      "Output directory containing generated TechDocs site.",
      "./site/"
    )
    .option(
      "--no-docker",
      "Do not use Docker, use MkDocs executable and plugins in current user environment."
    )
    .option(
      "--techdocs-ref <HOST_TYPE:URL>",
      "The repository hosting documentation source files e.g. github:https://ghe.mycompany.net.com/org/repo." +
        "\nThis value is same as the backstage.io/techdocs-ref annotation of the corresponding Backstage entity." +
        "\nIt is completely fine to skip this as it is only being used to set repo_url in mkdocs.yml if not found.\n"
    )
    .option("-v --verbose", "Enable verbose output.", false)
    .alias("build")
    .action(lazy(() => import("./generate/generate").then(m => m.default)));

  program
    .command("publish")
    .description(
      "Publish generated TechDocs site to an external storage AWS S3, Google GCS, etc."
    )
    .requiredOption(
      "--publisher-type <TYPE>",
      "(Required always) awsS3 | googleGcs | azureBlobStorage | openStackSwift - same as techdocs.publisher.type in Backstage app-config.yaml"
    )
    .requiredOption(
      "--storage-name <BUCKET/CONTAINER NAME>",
      "(Required always) In case of AWS/GCS, use the bucket name. In case of Azure, use container name. Same as techdocs.publisher.[TYPE].bucketName"
    )
    .requiredOption(
      "--entity <NAMESPACE/KIND/NAME>",
      "(Required always) Entity uid separated by / in namespace/kind/name order (case-sensitive). Example: default/Component/myEntity "
    )
    .option(
      "--azureAccountName <AZURE ACCOUNT NAME>",
      "(Required for Azure) specify when --publisher-type azureBlobStorage"
    )
    .option(
      "--azureAccountKey <AZURE ACCOUNT KEY>",
      "Azure Storage Account key to use for authentication. If not specified, you must set AZURE_TENANT_ID, AZURE_CLIENT_ID & AZURE_CLIENT_SECRET as environment variables."
    )
    .option(
      "--awsRoleArn <AWS ROLE ARN>",
      "Optional AWS ARN of role to be assumed."
    )
    .option(
      "--awsEndpoint <AWS ENDPOINT>",
      "Optional AWS endpoint to send requests to."
    )
    .option(
      "--osUsername <OPENSTACK SWIFT USERNAME>",
      "(Required for OpenStack) specify when --publisher-type openStackSwift"
    )
    .option(
      "--osPassword <OPENSTACK SWIFT PASSWORD>",
      "(Required for OpenStack) specify when --publisher-type openStackSwift"
    )
    .option(
      "--osAuthUrl <OPENSTACK SWIFT AUTHURL>",
      "(Required for OpenStack) specify when --publisher-type openStackSwift"
    )
    .option(
      "--osRegion <OPENSTACK SWIFT REGION>",
      "(Required for OpenStack) specify when --publisher-type openStackSwift"
    )
    .option(
      "--osAuthVersion <OPENSTACK SWIFT AUTHVERSION>",
      "Optional OpenStack. Default is setted to v3"
    )
    .option(
      "--osDomainId <OPENSTACK SWIFT DOMAIN ID>",
      "Optional OpenStack. Default is setted to default"
    )
    .option(
      "--osDomainName <OPENSTACK SWIFT DOMAIN NAME>",
      "Optional OpenStack. Default is setted to Default"
    )
    .option(
      "--directory <PATH>",
      "Path of the directory containing generated files to publish",
      "./site/"
    )
    .action(lazy(() => import("./publish/publish").then(m => m.default)));

  program
    .command("serve:mkdocs")
    .description("Serve a documentation project locally using MkDocs serve.")
    .option(
      "-i, --docker-image <DOCKER_IMAGE>",
      "The mkdocs docker container to use",
      "spotify/techdocs"
    )
    .option(
      "--no-docker",
      "Do not use Docker, run `mkdocs serve` in current user environment."
    )
    .option("-p, --port <PORT>", "Port to serve documentation locally", "8000")
    .option("-v --verbose", "Enable verbose output.", false)
    .action(lazy(() => import("./serve/mkdocs").then(m => m.default)));

  program
    .command("serve")
    .description(
      "Serve a documentation project locally in a Backstage app-like environment"
    )
    .option(
      "-i, --docker-image <DOCKER_IMAGE>",
      "The mkdocs docker container to use",
      "spotify/techdocs"
    )
    .option(
      "--no-docker",
      "Do not use Docker, use MkDocs executable in current user environment."
    )
    .option("--mkdocs-port <PORT>", "Port for MkDocs server to use", "8000")
    .option("-v --verbose", "Enable verbose output.", false)
    .action(lazy(() => import("./serve/serve").then(m => m.default)));
}

// Wraps an action function so that it always exits and handles errors
// Humbly taken from backstage-cli's registerCommands
function lazy(
  getActionFunc: () => Promise<(...args: any[]) => Promise<void>>
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const actionFunc = await getActionFunc();
      await actionFunc(...args);
      process.exit(0);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  };
}
