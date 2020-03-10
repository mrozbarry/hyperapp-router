import withRouter from './withRouter/index.js';

const { app, h } = window.hyperapp;

withRouter(app)({
  router: {
    routes: {
      '/': {
        OnEnter: state => ({
          ...state,
          viewFn: () => h('div', null, 'Root'),
        }),
      },
      '/:foo': {
        OnEnter: (state, params) => ({
          ...state,
          viewFn: () => h('div', null, [
            h('a', { href: '/' }, 'Back to root'),
            h('div', null, `The param you entered: ${params.foo}`),
          ]),
        }),
      },
    },
  },

  init: {
    viewFn: () => h('div', null, 'Loading router...'),
  },

  view: state => state.viewFn(state),

  node: document.querySelector('#app'),
});
