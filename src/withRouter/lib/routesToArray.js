import { match } from 'path-to-regexp';

const ensureStartsWithSlash = part => (
  `/${part.replace(/^\/+/, '')}`
);

export default ({ routes: routesObject, baseUrl }) => Object.keys(routesObject)
  .reduce((routes, initialPath) => {
    const path = ensureStartsWithSlash([
      baseUrl.replace(/.+(\/$)/, ''),
      initialPath.replace(/^\/+/, ''),
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
