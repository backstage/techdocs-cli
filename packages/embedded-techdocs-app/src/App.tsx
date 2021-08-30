import React from 'react';
import { Navigate, Route } from 'react-router';
import { createApp, FlatRoutes } from '@backstage/core';
import { CatalogEntityPage } from '@backstage/plugin-catalog';

import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { apis } from './apis';
import { Root } from './components/Root';
import * as plugins from './plugins';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Navigate key="/" to="/docs/default/component/local/" />
    {/* we need this route as TechDocs header links relies on it */}
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    />
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
