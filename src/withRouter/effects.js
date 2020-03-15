import { navigateByURI } from './lib/navigateByURI';

const NavigateByURIFX = (_dispatch, href) => {
  navigateByURI(href);
};
export const NavigateByURI = props => [
  NavigateByURIFX,
  props,
];
