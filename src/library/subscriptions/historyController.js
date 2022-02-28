const HistoryControllerFX = (dispatch, { bus, UpdateRouter }) => {
  const onMessage = ([type, data]) => {
    switch (type) {
      case 'push':
        window.history.pushState({}, '', data);
        dispatch(UpdateRouter, { currentPath: data });
        break;

      case 'replace':
        window.history.replaceState({}, '', data);
        dispatch(UpdateRouter, { currentPath: data });
        break;

      case 'back':
        dispatch(UpdateRouter, { currentPath: data });
        break;

      case 'transition':
        dispatch(...([].concat(data)));
        break;

      default:
        console.error('Unable to handle', data, 'because', type, 'is not valid');
        return;
    }
  };
  const cancel = bus.listen(onMessage);

  const onPop = (event) => {
    const backPath = event.originalTarget.location.pathname;
    onMessage(['back', backPath]);
  };
  window.addEventListener('popstate', onPop);

  return () => {
    window.removeEventListener('popstate', onPop);
    cancel();
  };
};
export const HistoryController = (props) => [HistoryControllerFX, props];
