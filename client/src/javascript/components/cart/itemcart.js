import { routeChange } from "../../lib/router.js";
import api from "../../lib/api.js";
import { getItem, setItem } from "../../lib/storage.js";
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
    if (!couponApi) return;
    $main.innerHTML = `
    <div class="cart_container">
      <div class="cart_title">
        <h1>장바구니/결제</h1>
      </div>
      <div class="coupon_container"></div>
      <div class="order_product_container"></div>
    </div>
    <button class="home_btn">
        <img src="/src/assets/icon-home.svg">
    </button>
    `;

    // * 쿠폰 항목 컴포넌트
    this.RenderCouponComponent = () => {
      document.querySelector(".coupon_container").innerHTML = `
      <div class="sub_title">
        <h2>쿠폰 사용</h2>
      </div>
      <div class="option_input_container"></div>
      `;
      this.selectedOption();
    };

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

    // * add cart product list component
    this.RenderOrderComponent = () => {
      document.querySelector(".order_product_container").innerHTML = `
        <div class="sub_title">
          <h2>주문 상품</h2>
        </div>
        <div class="sel_btn_del_container">
          <button class="sel_btn_del">선택 삭제 하기</button>
        </div>
        <div class="order_navbar">
          <ul class="order_lists">
            <li><input type="checkbox" id="allCheckbox"/><label for="allCheckbox"></label></li>
            <li>상품정보</li>
            <li>쿠폰 할인</li>
            <li>배송비</li>
            <li>주문금액</li>
          </ul>
        </div>
        <div class="cart_product_list"></div>
        <div class="order_amount_box"></div>
      `;
      this.RenderCartList();
      this.RenderOrderAmountBox();
    };

    this.RenderCartList = () => {
      if (cartData.length) {
        document.querySelector(".cart_product_list").innerHTML = `
        <ul class="product_cart_lists">
          ${cartData
            .map(
              (v) => `
            <li class="product_cart_list">
              <input type="checkbox" id="checkbox${v.id}" data-item-id="${v.id}" /><label for="checkbox${v.id}"></label>
              <div class="product_info_container">
                <img class="cart_product_img" src=${apiAddr}/${v.thumbnailImg} alt="thumbnailImg" />
                <div class="product_info">
                  <h1 class="cart_product_title">${v.productName}</h1>
                  <div class="product_price">
                    ${
                      v.discountRate
                        ? `<span class="price">${Math.floor(v.price * ((100 - v.discountRate) / 100)).toLocaleString(
                            "ko-KR"
                          )}원</span>`
                        : `<span class="price">${v.price.toLocaleString("ko-KR")}원</span>`
                    }
                    ${v.discountRate ? `<span class="origin_price">${v.price.toLocaleString("ko-KR")}원</span>` : ""}
                    ${v.discountRate > 0 ? `<span class="discount">${v.discountRate}%</span>` : ``}
                  </div>
                  <div class="product_detail">${
                    v.optionValue
                      ? `<div class="option_desc">옵션 : ${v.optionValue
                          .map(
                            (option) => `
                          <span>${option.optionName}(수량 : ${option.countValue}개)</span>
                          `
                          )
                          .join("/")}
                        </div>
                        `
                      : `<span>수량 : ${v.countValue}개</span>`
                  }</div>
                </div>
                <div class="coupon_discount">
                  <span>-</span>
                  <span>-</span>
                </div>
                <div class="prices">
                  <div class="shippingFee">${v.shippingFee.toLocaleString("ko-KR")}원</div>
                  <div class="order_price">
                    <span>${
                      v.optionValue
                        ? `${v.optionValue.reduce((a, b) => a + b.totalPrice, 0).toLocaleString("ko-KR")}`
                        : v.totalvalue.toLocaleString("ko-KR")
                    }원</span>
                  </div>
                </div>
              </div>
            </li>
            `
            )
            .join("")}
        </ul>
        `;
      } else {
        document.querySelector(
          ".cart_product_list"
        ).innerHTML = `<div class="empty_cart">장바구니에 담긴 상품이 없습니다.</div>`;
      }
    };
    this.RenderOrderAmountBox = () => {
      document.querySelector(".order_amount_box").innerHTML = `
      <div class="total_order_item">
        <div class="order_item">
          <span>총 상품금액</span>
          <span>80820원</span>
        </div>
        <div class="order_item">
          <img src="/src/assets/minus-icon-bg-white.svg" alt="" />
        </div>
        <div class="order_item">
          <span>쿠폰 할인</span>
          <span>4000원</span>
        </div>
        <div class="order_item">
          <img src="/src/assets/plus-icon-bg-white.svg" alt="" />
        </div>
        <div class="order_item">
          <span>배송비</span>
          <span>3000원</span>
        </div>
      </div>
      <div class="pay_amount">
        <span>결제 예정 금액</span>
        <span>79820원</span>
      </div>
      `;
    };
    this.RenderCouponComponent();
    this.RenderOrderComponent();

    // ! 이벤트 처리 부분
    const $home_btn = document.querySelector(".home_btn");
    $home_btn.addEventListener("click", () => {
      routeChange("/");
    });

    // * 쿠폰 옵션 박스 event 설정하기
    const $couponeOptionToggleBtn = document.querySelector(".toggle-btn");
    const $selectBoxOption = document.querySelector(".select-box-option");
    const allCheck = document.getElementById("allCheckbox");
    const checkboxs = document.querySelectorAll('input[type="checkbox"]:not(#allCheckbox)');

    if ($couponeOptionToggleBtn && $selectBoxOption) {
      $couponeOptionToggleBtn.addEventListener("click", () => {
        $selectBoxOption.classList.toggle("on");
        $couponeOptionToggleBtn.classList.toggle("on");
      });
      $selectBoxOption.addEventListener("click", (e) => {
        if (e.target.nodeName === "BUTTON") {
          $selectBoxOption.classList.remove("on");
          $couponeOptionToggleBtn.classList.remove("on");
        }
      });
    }

    // * 선택 삭제하기 버튼 클릭 이벤트 (체크박스의 체크하면 그 요소 삭제하기)
    const $selectDeleteBtn = document.querySelector(".sel_btn_del");
    $selectDeleteBtn.addEventListener("click", () => {
      if (window.confirm("상품을 삭제 하시겠습니까?")) {
        const checkedItemIds = [];
        checkboxs.forEach((element) => {
          if (element.checked) {
            checkedItemIds.push(+element.dataset.itemId);
          }
          // TODO checkbox를 checked를 하게 되면 checkbox의 dataset을 checkedItemIds에 저장
        });
        // TODO checkedItemIds 배열이 있으면(checkbox checked된 것) 아래의 if문 실행

        if (checkedItemIds.length > 0) {
          const filteredData = cartData.filter((item) => !checkedItemIds.includes(item.id));
          /**
           * TODO cartData의 id가 checkedItemIds의 id가 포함되면 true이나 체크된 것을 삭제 해야 하므로 !를 사용 하여 false로 만듦
           * TODO filter를 이용하여 콜백 함수의 조건에 충족한 cartData의 요소를 새로운 배열로 반환하여 filteredData 변수에 저장한다.
           **/

          setItem("product_carts", filteredData);
          // TODO 변경된 filteredData를 localStorage product_carts에 저장하기
        }
        routeChange("/cart");
      }
    });

    // AllCheckbox click event 설정하기

    allCheck.addEventListener("change", () => {
      checkboxs.forEach((_, i) => {
        if (checkboxs[i] != allCheck) {
          checkboxs[i].checked = allCheck.checked;
        }
      });
    });

    // 항목의 checkbox가 모두 체크되면 AllCheckbox가 체크 됨
    checkboxs.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const AllCheckbox = [...checkboxs].every((checkbox) => checkbox.checked);
        allCheck.checked = AllCheckbox;
      });
    });
  };
}
export default ItemCart;
