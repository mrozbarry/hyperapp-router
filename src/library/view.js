import * as State from './state.js';

export const view = (routeViews, fallbackRouteView, router) => {
  const route = State.getCurrentRoute(router.state);
  if (!route) return fallbackRouteView;

  const routeView = routeViews[route.path] || fallbackRouteView;
  return routeView;
};
