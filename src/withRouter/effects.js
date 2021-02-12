import { navigate } from './lib/navigate';

const NavigateFX = (_dispatch, { href, options }) => {
  navigate(href, options);
};
export const Navigate = props => [
  NavigateFX,
  props,
];
