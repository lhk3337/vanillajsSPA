import { routeChange } from "../../lib/router.js";
import api from "../../lib/api.js";
import { getItem, removeItem, setItem } from "../../lib/storage.js";
function ItemCart({ $main }) {
  const cartData = getItem("product_carts", []);

  // * 주문창에서 넘어온 해당 상품의 옵션들의 가격을 더해 v.totalValue에 저장, noDiscountTotalValue는 쿠폰 적용되지 않은 가격
  cartData?.forEach((v) => {
    if (!v.totalValue) {
      v.totalValue = v.optionValue ? v.optionValue.reduce((a, b) => a + b.optionTotalPrice, 0) : v.totalValue;
    }
    if (!v.noDiscountTotalValue) {
      v.noDiscountTotalValue = v.optionValue ? v.optionValue.reduce((a, b) => a + b.optionTotalPrice, 0) : v.totalValue;
    }
  });

  this.state = { couponApi: null, apiAddr: null };
  this.couponState = { cartData: [] };

  this.data = async () => {
    const couponApi = await (await api()).fetchCoupon();
    const apiAddr = (await api()).API_ADDR;
    this.state = { couponApi, apiAddr };
    this.setCouponState({ cartData });
  };

  this.setCouponState = (nextState) => {
    this.couponState = nextState;
    this.render();
  };

  this.data();

  //* 계산할 제품 총 가격 정보 데이터 함수
  const totalData = () => {
    const { cartData } = this.couponState;
    const noDiscountTotalValue = cartData.reduce((acc, curr) => acc + curr.noDiscountTotalValue, 0);
    const discount = cartData.reduce((acc, curr) => {
      if (curr.discount) {
        return acc + curr.discount;
      } else {
        return acc;
      }
    }, 0);
    const shippingFee = cartData.reduce((acc, curr) => acc + curr.shippingFee, 0);
    const pay_amount = cartData.reduce((acc, curr) => acc + curr.totalValue, 0);
    return { noDiscountTotalValue, discount, shippingFee, pay_amount };
  };

  this.render = async () => {
    const { couponApi, apiAddr } = this.state;
    const { cartData } = this.couponState;
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

    //* 쿠폰 select box container
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

    //* add cart product list component
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
        <div class="order_button_box"></div>
      `;
      this.RenderCartList();
      this.RenderOrderAmountBox();
      this.RenderOrderButton();
    };

    //* product cart list view Component
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
                  <span>${v.couponName ? `${v.couponName.substr(0, 15)}...` : "-"}</span>
                  <span>${v.discount ? `-${v.discount}원` : "-"}</span>
                </div>
                <div class="prices">
                  <div class="shippingFee">${v.shippingFee.toLocaleString("ko-KR")}원</div>
                  <div class="order_price">
                  <span>${v.totalValue.toLocaleString("ko-KR")}원</span>
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
        // * list에 아무 상품이 없을경우 처리하기
        document.querySelector(
          ".cart_product_list"
        ).innerHTML = `<div class="empty_cart">장바구니에 담긴 상품이 없습니다.</div>`;
      }
    };

    //* 계산할 가격 정보를 보여주는 Component
    this.RenderOrderAmountBox = () => {
      const { noDiscountTotalValue, discount, shippingFee, pay_amount } = totalData();

      document.querySelector(".order_amount_box").innerHTML = `
      <div class="total_order_item">
        <div class="order_item">
          <span>총 상품금액</span>
          <span>${noDiscountTotalValue.toLocaleString("ko-Kr")}원</span>
        </div>
        <div class="order_item">
          <img src="/src/assets/minus-icon-bg-white.svg" alt="" />
        </div>
        <div class="order_item">
          <span>쿠폰 할인</span>
          <span>${discount.toLocaleString("ko-Kr")}원</span>
        </div>
        <div class="order_item">
          <img src="/src/assets/plus-icon-bg-white.svg" alt="" />
        </div>
        <div class="order_item">
          <span>배송비</span>
          <span>${shippingFee.toLocaleString("ko-Kr")}원</span>
        </div>
      </div>
      <div class="pay_amount">
        <span>결제 예정 금액</span>
        <span>${(pay_amount + shippingFee).toLocaleString("ko-Kr")}원</span>
      </div>
      `;
    };

    //* 구매 버튼 Component
    this.RenderOrderButton = () => {
      document.querySelector(".order_button_box").innerHTML = `
        <button class="order_product_btn">선택 상품 주문하기</button>
      `;
    };
    this.RenderCouponComponent();
    this.RenderOrderComponent();

    //! 이벤트 처리 부분
    const $home_btn = document.querySelector(".home_btn");
    $home_btn.addEventListener("click", () => {
      routeChange("/");
    });

    //* 쿠폰 옵션 박스 event 설정하기
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

    const $optionSelectBtn = document.querySelectorAll(".option-btn");
    //* 쿠폰 select 클릭 event 설정하고 값 변경시키기
    $optionSelectBtn.forEach((element) => {
      element.addEventListener("click", () => {
        const {
          dataset: { optionId },
        } = element;
        const optionClickItem = couponApi.find((v) => v.id === +optionId);
        // TODO 해당 쿠폰 선택
        const updateData = this.couponState.cartData.map((item) => {
          if (item.id === optionClickItem.productid) {
            // TODO 쿠폰 아이디와 해당 상품 아이디가 같은 상품 선택되면 if문 실행
            return {
              ...item,
              discount: optionClickItem.discount === 1500 ? item.discount : optionClickItem.discount,
              shippingFee:
                item.shippingFee === 0
                  ? item.shippingFee
                  : optionClickItem.discount === 1500
                  ? optionClickItem.discount - item.shippingFee
                  : item.shippingFee,
              couponName: optionClickItem.couponName,
              totalValue: item.discount
                ? item.totalValue
                : item.totalValue - (optionClickItem.discount === 1500 ? 0 : optionClickItem.discount),
            };
            /**
             * TODO 쿠폰 아이디와 해당 상품 아이디가 같을때 if문 실행
             * TODO updateData에 배열 객체구조로 업데이트 시키기, discount, shippingFee, couponName, totalValue
             * TODO discount에서 optionClickItem.discount 값이 1500(배송료)이면 item.discount에 undefined로 객체를 생성 값이
             * TODO 2000(할인)이면 item.discount에  optionClickItem.discount인 2000을 생성
             * TODO 처음에 item.discount가 없기 때문에 후자가 실행되어 item.totalValue에서 discount가 2000인 것을 뺀 것을 item.totalValue로 업데이트 된다.
             * TODO item.discount가 생성되었다면 아까 item.discount 에서 2000을 뺀 item.totalValue를 불러 들임
             **/
          }
          return item;
        });
        this.setCouponState({
          ...this.couponState,
          cartData: updateData,
        });
        setItem("product_carts", updateData);
      });
    });

    //* 선택 삭제하기 버튼 클릭 이벤트 (체크박스의 체크하면 그 요소 삭제하기)
    const $selectDeleteBtn = document.querySelector(".sel_btn_del");
    $selectDeleteBtn.addEventListener("click", () => {
      const checkedItemIds = [];
      checkboxs.forEach((element) => {
        if (element.checked) {
          checkedItemIds.push(+element.dataset.itemId);
        }
        // TODO checkbox를 checked를 하게 되면 checkbox의 dataset을 checkedItemIds에 저장
      });
      // TODO checkedItemIds 배열이 있으면(checkbox checked된 것) 아래의 if문 실행

      if (checkedItemIds.length > 0) {
        if (window.confirm("상품을 삭제 하시겠습니까?")) {
          const filteredData = cartData.filter((item) => !checkedItemIds.includes(item.id));
          /**
           * TODO cartData의 id가 checkedItemIds의 id가 포함되면 true이나 체크된 것을 삭제 해야 하므로 !를 사용 하여 false로 만듦
           * TODO filter를 이용하여 콜백 함수의 조건에 충족한 cartData의 요소를 새로운 배열로 반환하여 filteredData 변수에 저장한다.
           **/

          setItem("product_carts", filteredData);
        }
        // TODO 변경된 filteredData를 localStorage product_carts에 저장하기
      }
      routeChange("/cart");
    });

    //* AllCheckbox click event 설정하기

    allCheck.addEventListener("change", () => {
      checkboxs.forEach((_, i) => {
        if (checkboxs[i] != allCheck) {
          checkboxs[i].checked = allCheck.checked;
        }
      });
    });

    //* 항목의 checkbox가 모두 체크되면 AllCheckbox가 체크 됨
    checkboxs.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const AllCheckbox = [...checkboxs].every((checkbox) => checkbox.checked);
        allCheck.checked = AllCheckbox;
      });
    });
    const $order_product_btn = document.querySelector(".order_product_btn");
    $order_product_btn.addEventListener("click", () => {
      if (window.confirm("상품을 구매하시겠습니까?")) {
        const { discount, shippingFee, pay_amount } = totalData();

        this.setCouponState({
          ...this.couponState,
          totalPrice: pay_amount + shippingFee,
          totalDiscount: discount,
          totalshippingFee: shippingFee,
        });
        removeItem("product_carts");
        routeChange("/");
        fetch("http://localhost:8080/mall", { method: "POST", body: { ...this.couponState } })
          .then((response) => response.json())
          .then((data) => console.log(data.success));
      }
    });
  };
}
export default ItemCart;
