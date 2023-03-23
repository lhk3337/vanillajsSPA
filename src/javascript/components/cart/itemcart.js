import { routeChange } from "../../lib/router.js";

function ItemCart({ $main }) {
  this.render = async () => {
    $main.innerHTML = `
    <div>
      <h1>Hello World</h1>
    </div>
    <button class="home_btn">
        <img src="/src/assets/icon-home.svg">
    </button>
    `;
    document.querySelector(".home_btn").addEventListener("click", () => {
      routeChange("/");
    });
  };
}
export default ItemCart;
