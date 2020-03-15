import * as constants from '../const';

export const navigate = (href, options = { type: 'push' }) => {
  const event = new CustomEvent(constants.ROUTER_EVENT, {
    detail: {
      ...options,
      href,
    },
  });

  document.dispatchEvent(event);
};

