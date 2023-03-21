import ItemList from "./components/item/itemlist.js";
import api from "./lib/api.js";
function App({ $target }) {
  const response = async () => {
    return await (await api()).fetchProductsList();
  };

  const { pathname } = location;

  if (pathname === "/") {
    return ItemList({ $target, data: response() });
  } else {
    console.log("Aaa");
  }
}

export default App;
