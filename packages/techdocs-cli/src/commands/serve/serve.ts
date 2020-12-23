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
import openBrowser from "react-dev-utils/openBrowser";
import { runMkdocsServer } from "../../lib/run";
import HTTPServer from "../../lib/httpServer";

export default async function serve() {
  // Mkdocs server
  const mkdocsServer = runMkdocsServer();

  // Run the embedded-techdocs Backstage app
  const techdocsPreviewBundlePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "dist",
    "techdocs-preview-bundle"
  );

  const httpServer = new HTTPServer(techdocsPreviewBundlePath, 3000)
    .serve()
    .catch(err => {
      console.error(err);
      mkdocsServer.then(childProcess => childProcess.kill());
    });

  await Promise.all([mkdocsServer, httpServer]).then(() => {
    openBrowser("http://localhost:3000/docs/local/dev/env/");
  });
}
