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
import withRouter from '@mrbarrysoftware/hyperapp-router';

withRouter(app)({
  router: {
    // Optional action ran every push/pop state
    RouteAction: (state, { params, path }) => ({
      ...state,
    }),
    
    routes: {
      '/': {
        // Optional Action to run when entering this route
        OnEnter: (params) => (state) => ({
          ...state,
        }),

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
