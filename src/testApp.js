import withRouter from './withRouter/index.js';
import { app, h, text } from 'hyperapp';

const ApiFX = (dispatch, { collection, id, Ok, Err }) => {
  fetch(`https://dummy-json-bf230.firebaseio.com/${collection}/${id}.json`)
    .then(r => r.json())
    .then(data => dispatch(Ok, data))
    .catch(err => dispatch(Err, err));
};
const Api = props => [ApiFX, props];

const SetTodo = (state, data) => ({
  ...state,
  todos: {
    ...state.todos,
    [data.id]: data
  },
  error: null,
});
const SetError = (state, error) => ({ ...state, error });

const viewTodo = id => state => {
  const todo = state.todos[id];

  if (!todo) {
    return h('div', {}, text(`Loading todo#${id}...`));
  }

  return h('div', {}, [
    h('label', { style: { display: 'block' } }, [
      h('input', { type: 'checkbox', checked: todo.completed, disabled: true }),
      text(todo.task),
    ]),
  ]);
};

withRouter(app)({
  router: {
    routes: {
      '/': {
        OnEnter: state => ({
          ...state,
          viewFn: () => h('div', {}, text('Root')),
        }),
      },
      '/todos/:id': {
        OnEnter: (state, params) => [
          {
            ...state,
            viewFn: viewTodo(params.id),
          },
          Api({
            collection: 'todos',
            id: params.id,
            Ok: SetTodo,
            Err: SetError,
          }),
        ],
      },
      '/(.*)': {
        OnEnter: (state) => ({
          ...state,
            viewFn: () => h('div', {}, [
              h('h1', {}, text('404: Page not found')),
            ]),
        }),
      },
    },
  },

  init: {
    todos: {},
    users: {},
    error: null,
    viewFn: () => h('div', {}, text('Loading router...')),
  },

  view: state => {
    return h('div', {}, [
      h('a', { href: '/' }, text('Back to root')),
      h('ol', {}, Array.from({ length: 4 }, (_, num) => (
        h('li', {}, h('a', { href: `/todos/${num}` }, text(`Todo ${num}`)))
      ))),
      state.error ? text(state.error.toString()) : state.viewFn(state),
    ]);
  },

  node: document.querySelector('#app'),
});
