import * as State from './state.js';

export const create = (routes, bus) => {
  const navigate = (path, type = 'push') => {
    const transitions = State.getTransitionsTo(path, { routes });

    transitions.currentAfter.forEach(t => bus.emit(['transition', t]));
    transitions.nextBefore.forEach(t => bus.emit(['transition', t]));
    bus.emit([type, path]);
    transitions.nextReady.forEach(t => bus.emit(['transition', t]));
  };

  return navigate;
};
