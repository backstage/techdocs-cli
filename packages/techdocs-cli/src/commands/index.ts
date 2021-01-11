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
    .description("Generate TechDocs documentation site using mkdocs.")
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
      "(Required) awsS3 | googleGcs - same as techdocs.publisher.type in Backstage app-config.yaml"
    )
    .requiredOption(
      "--bucket-name <BUCKET>",
      "(Required) Bucket to use. Same as techdocs.publisher.[TYPE].bucket"
    )
    .requiredOption(
      "--entity <NAMESPACE/KIND/NAME>",
      "(Required) Entity uid separated by / in namespace/kind/name order (case-sensitive). Example: default/Component/myEntity "
    )
    .option(
      "--directory <PATH>",
      "Path of the directory containing generated files to publish",
      "./site/"
    )
    .action(lazy(() => import("./publish/publish").then(m => m.default)));

  program
    .command("serve:mkdocs")
    .description("Serve a documentation project locally using mkdocs serve.")
    .option(
      "--no-docker",
      "Do not use docker, run `mkdocs serve` in current user environment."
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
      "--no-docker",
      "Do not use Docker, use MkDocs executable in current user environment."
    )
    .option("--mkdocs-port <PORT>", "Port for mkdocs server to use", "8000")
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
