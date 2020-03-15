import * as constants from '../const';

export const navigateByURI = (href) => {
  const event = new CustomEvent(constants.ROUTER_EVENT, {
    detail: { href },
  });

  document.dispatchEvent(event);
};

