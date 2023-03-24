import ItemList from "./components/item/itemlist.js";
import ItemCart from "./components/cart/itemcart.js";
import api from "./lib/api.js";
import { init } from "./lib/router.js";
// App은 생성자 함수
function App({ $target }) {
  const $main = document.createElement("main");
  $target.appendChild($main); // 부모 노드인 target밑에 새로운 $main 노드를 자식노드에 붙임
  const response = async () => {
    return await (await api()).fetchProductsList();
  };

  this.route = () => {
    const { pathname } = location;
    if (pathname === "/") {
      return new ItemList({ $target, $main, apiData: response() }).render();
    } else if (pathname === "/cart") {
      return new ItemCart({ $main }).render();
    }
  };
  init(this.route);
  this.route();
  window.addEventListener("popstate", this.route);
}

export default App;
