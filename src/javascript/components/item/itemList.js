import ItemDetail from "./itemDetail.js";
import api from "../../lib/api.js";
import { getItem, setItem, removeItem } from "../../lib/storage.js";
import { routeChange } from "../../lib/router.js";
export default function ItemList({ $target, $main, apiData }) {
  this.data = async () => {
    return {
      apiAddr: (await api()).API_ADDR,
      productData: await apiData,
    };
  };

  this.render = async () => {
    const { productData, apiAddr } = await this.data();
    // TODO api데이터 호출이 실패 했을때 404 not found 페이지 설정
    if (!productData) {
      $main.innerHTML = `
      <div class="not_found">
        <h1>404</h1>
        <span>Page Not Found</span>
      </div>`;
    } else {
      $main.innerHTML = `
          <ul class="product_container">
              ${productData
                .map((value, i) => {
                  return `
                <li class="product_list" data-key=${value.id}>
                  <div class="img_container">
                    <img class="product_img" src=${apiAddr}/${value.thumbnailImg} alt="thumbnailImg" />
                    ${value.stockCount === 0 ? `<div class="soldout"><span>SOLDOUT</span></div>` : ``}
                  </div>
                  <div class="product_content">
                    <div class="product_title">
                      <span>${
                        value.productName.length < 30 ? value.productName : value.productName.substring(0, 25)
                      }</span>
                      ${
                        getItem(value.id, "")
                          ? `<button class="heart_btn_on" />`
                          : `<button class="heart_btn_cancel" />`
                      }
                    </div>
                    <div class="product_value">
                      ${
                        value.discountRate
                          ? `<span class="price">${Math.floor(
                              value.price * ((100 - value.discountRate) / 100)
                            ).toLocaleString("ko-KR")}</span>원`
                          : `<span class="price">${value.price.toLocaleString("ko-KR")}</span>원`
                      }
                      ${
                        value.discountRate
                          ? `<span class="origin_price">${value.price.toLocaleString("ko-KR")}원</span>`
                          : ""
                      }
                      <span class="discount">${value.discountRate > 0 ? `${value.discountRate}%` : ""}</span>
                    </div>
                  </div>
                </li>
                `;
                })
                .join("")}
              </ul>
              <button class="cart_btn"><img src="/src/assets/cart-btn.svg"></button>
              `;

      // * 해당 아이템 클릭 시 상세 아이템 api 데이터 출력 및 하트 버튼에 대한 핸들링
      Array.from(document.querySelectorAll(".product_list")).map((v) =>
        v.addEventListener("click", (e) => {
          if (e.target.className === "heart_btn_cancel") {
            setItem(v.dataset.key, true);
            this.render();
          } else if (e.target.className === "heart_btn_on") {
            removeItem(v.dataset.key);
            this.render();
          } else {
            if (v.dataset.key) {
              new ItemDetail({ $target, id: v.dataset.key, listRender: () => this.render() }).Render();
              document.body.style.overflow = "hidden";
            }
          }
        })
      );
    }

    // * 카트 버튼 클릭 이벤트 핸들러
    if (document.querySelector(".cart_btn")) {
      document.querySelector(".cart_btn").addEventListener("click", () => {
        routeChange("/cart");
      });
    }
  };
}
