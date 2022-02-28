import * as State from '../state.js';

const HookOnAnchorClickFx = (_dispatch, props) => {
  const onClick = (event) => {
    if (!event.target.matches('a')) return;

    const href = event.target.getAttribute('href');

    if (State.doesRouteExist(href, props.state) || event.target.matches(props.anchorMatcher)) {
      event.preventDefault();
    }

    props.navigate(href);
  };
  document.addEventListener('click', onClick);

  return () => {
    document.removeEventListener('click', onClick);
  };
};
export const HookOnAnchorClick = props => [HookOnAnchorClickFx, props];
