# Hyperapp Router

[![npm (scoped)](https://img.shields.io/npm/v/@mrbarrysoftware/hyperapp-router?style=flat-square)](https://www.npmjs.com/package/@mrbarrysoftware/hyperapp-router)

> **Warning**
This is a beta release, and the API will be completely unstable.
Expect any change to be breaking until a proper API is ironed out.

## Install

```bash
npm install --save @mrbarrysoftware/hyperapp-router
# or
yarn add @mrbarrysoftware/hyperapp-router
```

## Usage

```js
import { app, h } from 'hyperapp';
import withRouter, { effects } from '@mrbarrysoftware/hyperapp-router';

const RouteAction = (state, { href }) => [
  state,
  effects.Navigate({ href }), // where href is a string, like `/route/path/here`
];

withRouter(app)({
  router: {
    // Optional action ran every push/pop state
    // Useful when you just need navigation to
    // set something in state
    RouteAction: (state, { params, path }) => ({
      ...state,
    }),

    // Optional boolean
    // Prevents the router from capturing every
    // click on an anchor and attempting to route
    // it. Removing this means you will need to
    // add custom actions and effects to allow
    // navigation with the router.
    // If not set, the default is false, and that's
    // probably what you want.
    disableAnchorCapture: false,
    
    routes: {
      '/': {
        // Optional Action to run when entering this route
        OnEnter: (params) => (state) => ({
          ...state,
        }),

        // Optional Action to run when leaving this route
        OnLeave: (params) => (state) => ({
          ...state,
        }),
      },
    },
  },

  init: {},

  view: state => {
    return h('div', null, 'Your app here...');
  },

  node: document.querySelector('#app'),
});
```
