import { match } from 'path-to-regexp';

import * as subscriptions from './subscriptions';

const routesToArray = (routesObject) => Object.keys(routesObject)
  .reduce((routes, path) => {
    const route = {
      ...routesObject[path],
      path,
      match: match(path),
    }

    return [
      ...routes,
      route,
    ];
  }, []);

export default (app) => ({ router, ...rest }) => {
  const originalSubscriptions = rest.subscriptions
    ? rest.subscriptions
    : () => [];

  const routes = routesToArray(router.routes);

  return app({
    ...rest,
    subscriptions: (state) => [
      ...originalSubscriptions(state),
      subscriptions.Push({
        routes,
      }),
    ],
  });
};
