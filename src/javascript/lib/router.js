const ROUTE_CHANGE_EVENT = "ROUTE_CHANGE";

export const init = (onRouteChange) => {
  window.addEventListener(ROUTE_CHANGE_EVENT, () => {
    onRouteChange();
  });
}; // "ROUTE_CHANGE"라는 custom event가 발생할때 app.js에 있는 this.route 메서드를 실행한다. (리렌더링)

export const routeChange = (url, params) => {
  history.pushState(null, null, url);
  window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT, params));
};
// "ROUTE_CHANGE"라는 custom event를 만들고 등록하기
