import { routeChange } from "../../lib/router.js";
import api from "../../lib/api.js";
import { getItem } from "../../lib/storage.js";
function ItemCart({ $main }) {
  const cartData = getItem("product_carts", []);
  this.state = { couponApi: null, apiAddr: null };
  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.data = async () => {
    const couponApi = await (await api()).fetchCoupon();
    const apiAddr = (await api()).API_ADDR;
    this.setState({ ...this.state, couponApi, apiAddr, cartData });
  };
  this.data();
  this.render = async () => {
    const { couponApi, apiAddr, cartData } = this.state;
    console.log(couponApi);
    if (!couponApi) return;
    $main.innerHTML = `
    <div class="cart_container">
      <div class="cart_title">
        <h1>장바구니/결제</h1>
      </div>
      <div class="coupon_container">
        <div class="sub_title">
          <h2>쿠폰 사용</h2>
        </div>
        <div class="option_input_container"></div>
      </div>
      <div class="order_product_container">
        <div class="sub_title">
          <h2>주문 상품</h2>
        </div>
        <div class="sel_btn_del_container">
          <button class="sel_btn_del">선택 삭제 하기</button>
        </div>
        <div class="order_navbar">
          <ul class="order_lists">
            <li><button><img src="/src/assets/icon-check-box-ON.svg" alt=""checkedbox" /></button></li>
            <li>상품정보</li>
            <li>쿠폰 할인</li>
            <li>배송비</li>
            <li>주문금액</li>
          </ul>
        </div>
      </div>
    </div>
    <button class="home_btn">
        <img src="/src/assets/icon-home.svg">
    </button>
    `;
    const $option__container = document.createElement("div");
    const $counter = document.createElement("div");
    $counter.className = "count__number_container";
    $option__container.className = "option__container";

    this.selectedOption = () => {
      if (document.querySelector(".option_input_container")) {
        document.querySelector(".option_input_container").appendChild($option__container);
        $option__container.innerHTML = `
        <div class="select-box">
          <button class="toggle-btn">쿠폰 선택</button>
          <ul class="select-box-option">
          ${couponApi
            .map((v) => {
              return `<li><button class="option-btn" data-option-id=${v.id}>${v.couponName}</button></li>`;
            })
            .join("")}
          </ul>
        </div>
          `;
      }
    };
    this.selectedOption();
    // ! 이벤트 처리 부분
    const $home_btn = document.querySelector(".home_btn");
    $home_btn.addEventListener("click", () => {
      routeChange("/");
    });

    const $optionToggleBtn = document.querySelector(".toggle-btn");
    const $selectBoxOption = document.querySelector(".select-box-option");
    if ($optionToggleBtn && $selectBoxOption) {
      $optionToggleBtn.addEventListener("click", () => {
        $selectBoxOption.classList.toggle("on");
        $optionToggleBtn.classList.toggle("on");
      });
      $selectBoxOption.addEventListener("click", (e) => {
        if (e.target.nodeName === "BUTTON") {
          $selectBoxOption.classList.remove("on");
          $optionToggleBtn.classList.remove("on");
        }
      });
    }
  };
}
export default ItemCart;
