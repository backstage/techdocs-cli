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
import path from "path";
import { Command } from "commander";
import { runMkdocsServer } from "../../lib/mkdocsServer";
import HTTPServer from "../../lib/httpServer";

export default async function serve(cmd: Command) {
  // TODO: Backstage app port should also be configurable as a CLI option. However, since we bundle
  // a backstage app, we define app.baseUrl in the app-config.yaml.
  // Hence, it is complicated to make this configurable.
  const backstagePort = 3000;

  // Mkdocs server
  const mkdocsServer = runMkdocsServer({
    port: cmd.mkdocsPort,
    useDocker: cmd.docker
  });

  // Run the embedded-techdocs Backstage app
  const techdocsPreviewBundlePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "dist",
    "techdocs-preview-bundle"
  );

  const httpServer = new HTTPServer(
    techdocsPreviewBundlePath,
    backstagePort,
    cmd.mkdocsPort
  )
    .serve()
    .catch(err => {
      console.error(err);
      mkdocsServer.then(childProcess => childProcess.kill());
    });

  await Promise.all([mkdocsServer, httpServer]).then(() => {
    // The last three things default/component/local/ don't matter. They can be anything.
    // TODO: openBrowser and console.log is not working. Too bad.
    // openBrowser("http://localhost:3000/docs/default/component/local/");
    console.log(
      `Please open http://localhost:${backstagePort}/docs/default/component/local/ in browser`
    );
  });
}
