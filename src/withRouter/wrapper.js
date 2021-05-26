import * as subscriptions from './subscriptions';
import routesToArray from './lib/routesToArray';

export default (app) => ({ router, ...rest }) => {
  const originalSubscriptions = rest.subscriptions
    ? rest.subscriptions
    : () => [];

  const routes = routesToArray({
    baseUrl: '',
    ...router,
  });

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
