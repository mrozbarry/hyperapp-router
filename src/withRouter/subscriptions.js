const ROUTER_EVENT = 'hyperapp-router-navigate';

export const navigateByURI = (href) => {
  const event = new CustomEvent(ROUTER_EVENT, {
    detail: {
      href,
    },
  });

  document.dispatchEvent(event);
};

const PushFX = (dispatch, props) => {
  let currentRoute = {};

  const onPush = (route, match) => {
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

    window.history.pushState({}, '', match.path);
  };

  const findRouteAndMatch = (href) => {
    let route;
    for (route of props.routes) {
      const match = route.match(href);
      if (!match) continue;

      return { route, match };
    }

    return null;
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

  const init = () => {
    const result = findRouteAndMatch(window.location.pathname);
    return onPush(result.route, result.match);
  };

  setTimeout(init, 0);

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener(ROUTER_EVENT, onNavigate);
  };
};
export const Push = (props) => [PushFX, props];
