import { app, h, text } from 'hyperapp';
import * as hR from './library/index.js';

const Increment = (state) => ({ ...state, clicks: state.clicks + 1 });
const UpdateRouter = (state, { currentPath }) => ({
  ...state,
  router: hR.updateCurrentPath(currentPath, state.router),
});

const router = hR.create(
  {
    '/': hR.route({
      before: [],
      ready: [],
      after: [],
    }),

    '/foo': hR.route({
      before: [],
      ready: [],
      after: [],
    }),

    '/baz': hR.route({
      before: [],
      ready: [],
      after: [],
    }),
  },
  '/',
);

app({
  init: [
    {
      router,
      clicks: 0,
    },
    router.initEffect(window.location.pathname),
  ],

  view: (state) => h(
    'main',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1rem',
      },
    },
    [
      h('article', {}, [
        h('nav', {}, [
          h('a', { href: '/', 'x-routable': 'true' }, text('Home')),
          text(' | '),
          h('a', { href: '/foo', 'x-routable': 'true' }, text('Foo')),
          text(' | '),
          h('a', { href: '/baz', 'x-routable': 'true' }, text(`Baz (${state.clicks})`)),
          text(' | '),
          h('a', { href: '/does-not-exist', 'x-routable': 'true' }, text('Should 404')),
          text(' | '),
          h('a', { href: '/will-reload-not-exists' }, text('Should reload & 404')),
          text(' | '),
          h('a', { href: 'https://mrbarry.com/' }, text('External Link')),
        ]),
        hR.view(
          {
            '/': h('section', {}, [
              h('h1', {}, text('Default Route')),
              h('p', {}, text('Here is the default route. Pretty fancy, if I do say so myself!')),
            ]),
            '/foo': h('section', {}, [
              h('h1', {}, text('Foo Route')),
              h('p', {}, text('Here is the foo route. Not much special about this one')),
            ]),
            '/baz': h('section', {}, [
              h('h1', {}, text('Bar Route')),
              h('button', { type: 'button', onclick: Increment }, text(`Button clicked ${state.clicks} times`)),
            ]),
          },
          h('section', {
            style: {
              paddingTop: '40vh',
              textAlign: 'center',
            },
          }, [
            h('p', {}, [
              text('Route '),
              h('strong', {}, text(state.router.state.currentPath)),
              text(' not found'),
            ]),
          ]),
          state.router,
        ),
      ]),

      h('aside', {}, [
        h('p', {}, text('And this is what the app state looks like:')),
        h('pre', {}, h('code', {}, text(JSON.stringify(state, null, 2)))),
      ]),
    ]
  ),

  subscriptions: (state) => [
    hR.subscriptions.HistoryController({ bus: state.router.bus, UpdateRouter }),
    // hR.subscriptions.hashController({ router: state.router, routerKey: 'router' }),
    hR.subscriptions.HookOnAnchorClick({
      state: state.router.state,
      navigate: state.router.navigate,
      anchorMatcher: 'a[href][x-routable]',
    }),
  ],

  node: document.querySelector('#app'),
});
