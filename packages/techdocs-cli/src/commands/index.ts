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
    .command("serve:mkdocs")
    .description("Serve a documentation project locally using mkdocs serve.")
    .option(
      "--no-docker",
      "Do not use docker, run `mkdocs serve` in current user environment."
    )
    .option("-p, --port <PORT>", "Port to serve documentation locally", "8000")
    .option("-v --verbose", "View additional logs", false)
    .action(lazy(() => import("./serve/mkdocs").then(m => m.default)));

  program
    .command("serve")
    .description(
      "Serve a documentation project locally in a Backstage app-like environment"
    )
    .option(
      "--no-docker",
      "Do not use docker, use mkdocs executable in current user environment."
    )
    .option("--mkdocs-port <PORT>", "Port for mkdocs server to use", "8000")
    .option("-v --verbose", "View additional logs", false)
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
      process.exit(1);
    }
  };
}
