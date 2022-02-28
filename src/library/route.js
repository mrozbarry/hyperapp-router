export const route = transitions => ({
  before: transitions.before || [],
  ready: transitions.ready || [],
  after: transitions.after || [],
});
