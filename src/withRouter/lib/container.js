import routesToArray from './routesToArray';

export default (routesObject, options = {}) => {
  const routes = routesToArray({
    routesObject,
    baseUrl: options.baseUrl || '',
  });

  return {
    hof: (app) => (props) => app(props),
    navigate: (route) => [
      function navigateFx(_dispatch, props) {
        const appRoute = routes.find(r => r.match(props.route));
        console.log('TODO: navigate to', appRoute);
      },
      { route },
    ],
  }
};
