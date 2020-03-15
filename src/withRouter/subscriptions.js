import * as constants from './const';
import { navigateByURI } from './lib/navigateByURI';

const makeFindRouteAndMatch = (routes) => (href) => {
  let route;
  for (route of routes) {
    const match = route.match(href);
    if (!match) continue;

    return { route, match };
  }

  return null;
};

const PushFX = (dispatch, props) => {
  let currentRoute = {};

  const findRouteAndMatch = makeFindRouteAndMatch(props.routes);

  const setCurrentRoute = (route, match) => {
    if (currentRoute.OnLeave) {
      dispatch(currentRoute.OnLeave(currentRoute.params));
    }

    if (props.RouteAction) {
      dispatch(props.RouteAction({
        params: match.params,
        path: match.path,
      }));
    }

    currentRoute = {
      ...route,
      params: match.params,
    };

    if (currentRoute.OnEnter) {
      dispatch(currentRoute.OnEnter(currentRoute.params));
    }
  };

  const onPush = (route, match) => {
    setCurrentRoute(route, match);
    window.history.pushState({}, '', match.path);
  };

  const onReplace = (route, match) => {
    setCurrentRoute(route, match);
    window.history.replaceState({}, '', match.path);
  };

  const getNavigateMethod = (type) => {
    switch (type) {
    case 'replace':
      return onReplace;

    default:
      return onPush;
    }
  }

  const onNavigate = (event) => {
    const method = getNavigateMethod(event.detail.type);
    const result = findRouteAndMatch(event.detail.href);
    return method(result.route, result.match);
  };
  document.addEventListener(constants.ROUTER_EVENT, onNavigate);

  const onPop = (event) => {
    const result = findRouteAndMatch(event.originalTarget.location.pathname);
    return setCurrentRoute(result.route, result.match);
  };
  window.addEventListener('popstate', onPop);

  const init = () => {
    return onPop({ originalTarget: window });
  };

  setTimeout(init, 0);

  return () => {
    document.removeEventListener(constants.ROUTER_EVENT, onNavigate);
    window.removeEventListener('popstate', onPop);
  };
};
export const Push = (props) => [PushFX, props];

const AnchorFX = (_dispatch, props) => {
  const findRouteAndMatch = makeFindRouteAndMatch(props.routes);

  const onClick = (event) => {
    if (!event.target.matches('a')) return null;

    const href = event.target.getAttribute('href');
    if (!findRouteAndMatch(href)) return null;

    event.preventDefault();
    return navigateByURI(href, { type: 'push' });
  };
  document.addEventListener('click', onClick);

  return () => {
    document.removeEventListener('click', onClick);
  };
};
export const Anchor = props => [AnchorFX, props];
