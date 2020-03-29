import { match } from 'path-to-regexp';

import * as subscriptions from './subscriptions';

const ensureStartsWithSlash = part => (
  `/${part.replace(/^\//, '').replace(/\/+$/, '')}`
);

const routesToArray = ({ routes: routesObject, baseUrl }) => Object.keys(routesObject)
  .reduce((routes, initialPath) => {
    const path = ensureStartsWithSlash([
      (baseUrl || '/').replace(/.+(\/$)/, ''),
      initialPath.replace(/^\//, ''),
    ]
      .map(ensureStartsWithSlash)
      .join(''));

    const route = {
      ...routesObject[initialPath],
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

  const routes = routesToArray(router);

  return app({
    ...rest,
    subscriptions: (state) => [
      ...originalSubscriptions(state),
      subscriptions.Push({
        routes,
        RouteAction: router.RouteAction,
      }),
      !router.disableAnchorCapture && subscriptions.Anchor({
        routes,
      }),
    ],
  });
};
