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
import { ChildProcess } from "child_process";
import { run } from "./run";

const runMkdocsInDocker = (port: string): ChildProcess => {
  return run("docker", [
    "run",
    "-w",
    "/content",
    "-v",
    `${process.cwd()}:/content`,
    "-p",
    `${port}:${port}`,
    "spotify/techdocs",
    "serve",
    "--dev-addr",
    `0.0.0.0:${port}`
  ]);
};

const runMkdocsWithoutDocker = (port: string): ChildProcess => {
  console.log("Running without docker");
  return run("mkdocs", ["serve", "--dev-addr", `localhost:${port}`]);
};

export const runMkdocsServer = (options: {
  port?: string;
  useDocker?: boolean;
}): Promise<ChildProcess> => {
  const port = options.port ?? "8000";
  const useDocker = options.useDocker ?? true;

  return new Promise(resolve => {
    let childProcess: ChildProcess;
    if (useDocker) {
      childProcess = runMkdocsInDocker(port);
    } else {
      childProcess = runMkdocsWithoutDocker(port);
    }

    // Note/TODO: This thing is not working. We don't always want to see
    // all the logs from the `run()` function, especially if they are run inside docker.
    // Create a log pipe function here, pass it in run() as an option.
    // Make child.process.stdout use the log function
    childProcess.stdout?.on("data", rawData => {
      const data = rawData.toString().split("\n")[0];
      console.log("[mkdocs] ", data);

      if (data.includes(`Serving on http://0.0.0.0${port}`)) {
        resolve(childProcess);
      }
    });
  });
};
