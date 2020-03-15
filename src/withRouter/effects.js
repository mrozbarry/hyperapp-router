import { navigate } from './lib/navigate';

const NavigateFX = (_dispatch, href) => {
  navigate(href);
};
export const Navigate = props => [
  NavigateFX,
  props,
];
