import { match } from 'path-to-regexp';
import { Bus } from './bus.js';

const normalizePath = (path) => path ? path.replace(/\/+$/, '/') : '';

const transformRoutes = (routes) => {
  return Object.keys(routes).reduce((transformed, path) => {
    const normalized = normalizePath(path);
    const matcher = match(normalized);
    transformed.set(matcher, {
      ...routes[path],
      path: normalized,
    })
    return transformed;
  }, new Map());
};

export const create = (routes, baseUrl = '/') => {
  return {
    routes: transformRoutes(routes),
    baseUrl,
    currentPath: null,
  };
};

export const update = (currentPath, routerState) => ({
  ...routerState,
  currentPath: normalizePath(currentPath),
});

export const doesRouteExist = (path, routerState) => {
  const entries = Array.from(routerState.routes.entries());
  const entry = entries.find(([matcher, route]) => {
    const result = matcher(path);
    return result || route.path === path;
  });

  return Boolean(entry);
};

export const getRoute = (path, routerState) => {
  const entries = Array.from(routerState.routes.entries());
  const entry = entries.find(([matcher, route]) => {
    const result = matcher(path);
    return result || route.path === path;
  });

  if (!entry) {
    return {
      before: [],
      ready: [],
      after: [],
      path: null,
      meta: {},
    };
  }

  const [matcher, route] = entry;

  return {
    ...route,
    meta: matcher(path),
  };
};

export const getCurrentRoute = (routerState) => getRoute(routerState.currentPath, routerState);

export const getTransitionsTo = (path, routerState) => {
  const route = getRoute(normalizePath(path), routerState);
  if (!route) {
    return null;
  }

  const currentRoute = getCurrentRoute(routerState);

  return {
    currentAfter: currentRoute.after,
    nextBefore: route.before,
    nextReady: route.ready,
  };
};

export class State {
  constructor(routes, baseUrl = '/') {
    this._baseUrl = this.normalize(baseUrl);
    this._routes = this._transformRoutes(routes);
    this._currentPath = null;
    this._bus = new Bus();
  }

  get currentPath() {
    return this._currentPath;
  }

  get currentRoute() {
    const routeMeta = this.getRouteFromPath(this._currentPath);
    if (!routeMeta) return {
      before: [],
      ready: [],
      after: [],
    };

    const [matcherFn, route] = routeMeta;
    return {
      ...route,
      meta: matcherFn(this._currentPath),
    };
  }

  normalize(path) {
  }

  getRouteFromPath(path) {
    const entries = Array.from(this._routes.entries());
    return entries.find(([matcher, route]) => {
      const result = matcher(path);
      return result || route.path === path;
    });
  }

  _transformRoutes(routes) {
  }

  syncFromHash(hash) {
    const routableHash = `#!${this._baseUrl}`;
    return this._syncByPath(hash.slice(routableHash.length));
  }

  syncFromPath(pathname) {
    return this._syncByPath(pathname);
  }

  _syncByPath(path) {
    const normalizedPath = this.normalize(path);
    const routeMeta = this.getRouteFromPath(normalizedPath);
    if (!routeMeta) {
      return this;
    }

    this._currentPath = normalizedPath;

    return this;
  }

  getTransitionsTo(path) {
    const routeMeta = this.getRouteFromPath(this.normalize(path));
    if (!routeMeta) {
      return null;
    }

    const [_, route] = routeMeta;
    const currentRoute = this.currentRoute;

    return [
      ...currentRoute.after,
      ...route.before,
      ...route.ready,
    ];
  }

  navigate(path) {
    this._bus.emit(['push', path]);
  }

  init(path) {
    return [
      () => this.navigate(path),
      {},
    ];
  }
}
