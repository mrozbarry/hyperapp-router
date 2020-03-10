import withRouter from './withRouter/index.js';

const { app, h } = window.hyperapp;

const ApiFX = (dispatch, { collection, id, Ok, Err }) => {
  fetch(`https://jsonplaceholder.typicode.com/${collection}/${id}`)
    .then(r => r.json())
    .then(data => dispatch(Ok, data))
    .catch(err => dispatch(Err, err));
};
const Api = props => [ApiFX, props];

const SetUser = (state, data) => ({ ...state, users: { ...state.users, [data.id]: data }, error: null });
const SetTodo = (state, data) => [
  { ...state, todos: { ...state.todos, [data.id]: data }, error: null },
  Api({ collection: 'users', id: data.userId, Ok: SetUser, Err: SetError }),
];
const SetError = (state, error) => ({ ...state, error });

const viewTodo = id => state => {
  const todo = state.todos[id];

  if (!todo) {
    return h('div', null, `Loading todo#${id}...`);
  }

  const user = state.users[todo.userId];

  return h('div', null, [
    h('label', { style: { display: 'block' } }, [
      h('input', { type: 'checkbox', checked: todo.completed, disabled: true }),
      todo.title,
    ]),

    !!user && h('div', null, [
      'Author: ',
      h('a', { href: `/users/${todo.userId}` }, user.name),
    ]),
  ]);
};

const viewUser = id => state => {
  const user = state.users[id];

  if (!user) {
    return h('div', null, `Loading user#${id}...`);
  }

  return h('div', null, [
    h('h1', null, user.name),
    h('h2', null, [
      user.company.name,
    ]),
    h('div', null, user.website),
  ]);
}

withRouter(app)({
  router: {
    routes: {
      '/': {
        OnEnter: () => state => ({
          ...state,
          viewFn: () => h('div', null, 'Root'),
        }),
      },
      '/todos/:id': {
        OnEnter: (params) => (appState) => [
          {
            ...appState,
            viewFn: viewTodo(params.id),
          },
          Api({ collection: 'todos', id: params.id, Ok: SetTodo, Err: SetError }),
        ],
      },
      '/users/:id': {
        OnEnter: (params) => (appState) => [
          {
            ...appState,
            viewFn: viewUser(params.id),
          },
          Api({ collection: 'users', id: params.id, Ok: SetUser, Err: SetError }),
        ],
      },
      '/(.*)': {
        OnEnter: () => (appState) => ({
          ...appState,
            viewFn: () => h('div', null, [
              h('h1', null, '404: Page not found'),
            ]),
        }),
      },
    },
  },

  init: {
    todos: {},
    users: {},
    error: null,
    viewFn: () => h('div', null, 'Loading router...'),
  },

  view: state => {
    return h('div', null, [
      h('a', { href: '/' }, 'Back to root'),
      h('ol', null, Array.from({ length: 5 }, (_, index) => index + 1).map(num => (
        h('li', null, h('a', { href: `/users/${num}` }, `User ${num}`))
      ))),
      h('ol', null, Array.from({ length: 5 }, (_, index) => index + 1).map(num => (
        h('li', null, h('a', { href: `/todos/${num}` }, `Todo ${num}`))
      ))),
      state.error ? state.error.toString() : state.viewFn(state),
    ]);
  },

  node: document.querySelector('#app'),
});
