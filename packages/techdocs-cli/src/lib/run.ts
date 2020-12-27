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
import { spawn, ChildProcess } from "child_process";

// TODO: Accept log functions to pipe logs with.
export const run = (name: string, args: string[] = []): ChildProcess => {
  const [stdin, stdout, stderr] = [
    "inherit" as const,
    "pipe" as const,
    "inherit" as const
  ];

  const childProcess = spawn(name, args, {
    stdio: [stdin, stdout, stderr],
    shell: true,
    env: {
      ...process.env,
      FORCE_COLOR: "true"
    }
  });

  childProcess.once("error", error => {
    console.error(error);
    childProcess.kill();
  });

  childProcess.once("exit", () => {
    process.exit(0);
  });

  return childProcess;
};
