const ROUTER_EVENT = 'hyperapp-router-navigate';

export const navigateByURI = (href) => {
  const event = new CustomEvent(ROUTER_EVENT, {
    detail: { href },
  });

  document.dispatchEvent(event);
};

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

  const onClick = (event) => {
    if (!event.target.matches('a')) return null;

    const result = findRouteAndMatch(event.target.getAttribute('href'));
    if (!result) return null;

    event.preventDefault();
    return onPush(result.route, result.match);
  };
  document.addEventListener('click', onClick);

  const onNavigate = (event) => {
    const result = findRouteAndMatch(event.detail.href);
    return onPush(result.route, result.match);
  };
  document.addEventListener(ROUTER_EVENT, onNavigate);

  const onPop = () => {
    const result = findRouteAndMatch(window.location.pathname);
    if (result) setCurrentRoute(result.route, result.match);
  };
  window.addEventListener('popstate', onPop);

  const init = () => {
    return onPop();
  };

  setTimeout(init, 0);

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener(ROUTER_EVENT, onNavigate);
    window.removeEventListener('popstate', onPop);
  };
};
export const Push = (props) => [PushFX, props];
