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

import { createApp, AlertDisplay, OAuthRequestDialog } from "@backstage/core";
import React, { FC } from "react";
import Root from "./components/Root";
import { hot } from "react-hot-loader/root";
import * as plugins from "./plugins";
import { Router as DocsRouter } from "@backstage/plugin-techdocs";
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Route, Routes } from "react-router";

const app = createApp({
  apis: [],
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const EntityPage = () => {
    return (
        <div>test</div>
    );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DocsRouter />} />
    <Route
      path="/catalog/*"
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
  </Routes>
);

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>
        <AppRoutes />
      </Root>
    </AppRouter>
  </AppProvider>
);

export default hot(App);
