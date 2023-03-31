import api from "../../lib/api.js";
import { getItem, setItem, removeItem } from "../../lib/storage.js";
function ItemDetail({ $target, id, listRender }) {
  this.state = { apiAddr: null, apiData: null };
  this.likeState = { liked: Boolean(getItem(id, "")) };

  //상태를 변경 하는 메서드
  this.setState = (nextState) => {
    this.state = nextState;
    this.Render();
  };
  this.selectedOptions = [];
  // 좋아요 상태 변경 메서드
  this.setLikeState = (nextState) => {
    this.likeState = nextState;
    this.likedButton(); // 좋아요 버튼 클릭 좋아요 버튼 컴포넌트 리랜더링
  };
  // api 데이터를 받아오는 메서드
  this.data = async () => {
    const apiAddr = (await api()).API_ADDR;
    const apiData = await (await api()).fetchProduct(id);
    this.setState({ ...this.state, apiAddr, apiData });
  };

  this.data();

  const $modal = document.createElement("div");
  $modal.className = "item_modal";
  $target.appendChild($modal);

  // 메인 component, 렌더링이 발생되는 메서드
  this.Render = () => {
    const { apiData, apiAddr } = this.state;
    if (!apiData) {
      $modal.innerHTML = `
      <div class="modal_container">
        <button class="closeBtn">
          <img src="/src/assets/icon-delete.svg" alt="closeBtn" /> 
        </button>
        <!-- <div class="modal_loading"><h1>Loading...</h1></div> -->
      </div>
    `;
    } else {
      $modal.innerHTML = `
      <div class="modal_container">
        <button class="closeBtn">
          <img src="/src/assets/icon-delete.svg" alt="closeBtn" /> 
        </button>
        <div class="modal_content"></div>
      </div>`;

      // 상품 정보 위의 렌더링
      // 상품 이미지와 오른쪽 buy_info가 담겨질 components
      this.RenderTopInfo = () => {
        const $topInfo = document.createElement("div");
        $topInfo.className = "product_top_info";
        document.querySelector(".modal_content").appendChild($topInfo);
        $topInfo.innerHTML = `
        <img class="product_img" src=${apiAddr}/${apiData.thumbnailImg} alt="thumbnailImg" />
        <div class="product_buy"></div>
      `;

        this.RenderBuyInfo(); // 하위 컴포넌트 호출
      };

      // 상품의 이름과 가격 정보를 표시하는 component
      const $buyInfo = document.createElement("div");
      $buyInfo.className = "buy_info";
      this.RenderBuyInfo = () => {
        document.querySelector(".product_buy").appendChild($buyInfo);
        $buyInfo.innerHTML = `
        <span class="buy_name">${apiData?.productName}</span>
        <div class="buy_value">
          ${
            apiData.discountRate
              ? `<span class="price">${Math.floor(
                  apiData?.price * ((100 - apiData?.discountRate) / 100)
                ).toLocaleString("ko-KR")}</span>원`
              : `<span class="price">${apiData?.price.toLocaleString("ko-KR")}</span>원`
          }
          ${apiData.discountRate ? `<span class="origin_price">${apiData.price.toLocaleString("ko-KR")}원</span>` : ""}
          ${apiData.discountRate > 0 ? `<span class="discount">${apiData.discountRate}%</span>` : ``}
        </div>
        ${
          apiData.stockCount > 0
            ? `
            <div class="shipping_info">
              <span>
                택배배송 / ${apiData.shippingFee > 0 ? `${apiData.shippingFee.toLocaleString("ko-KR")}원` : "무료배송"}
              </span>
            </div>
            `
            : ""
        }
        
      `;
        this.RenderBuyInput(); //  하위 컴포넌트 호출
      };

      // 상품의 갯수 선택, 상품의 옵션 선택, 구매버튼, 좋아요 버튼, 카트 모달버튼을 포함한 component
      const $buyInput = document.createElement("div");
      $buyInput.className = "buy_input";
      this.RenderBuyInput = () => {
        document.querySelector(".product_buy").appendChild($buyInput);

        if (apiData.stockCount > 0) {
          $buyInput.innerHTML = `
            <div class="count_container">
              ${
                Array.isArray(apiData.option) && apiData.option.length === 0
                  ? `<input type="number" name="" id="" />`
                  : `
                  <div class="option__container">
                  <div class="select-box">
                    <div class="options-container">
                      ${apiData.option
                        .map(
                          (v) => `
                      <div class="option">
                        <input type="radio" class="radio" id="${v.id}" value="${v.id}" name="category" />
                        <label for="${v.id}">${v.optionName} ${
                            v.additionalFee > 0 ? `(+${v.additionalFee}원)` : ""
                          }</label>
                      </div>
                      `
                        )
                        .join("")}
                    </div>
                    <div class="selected">옵션을 선택하세요</div>
                  </div>
                  ${this.selectedOptions
                    .map(
                      (selectedOption) => `
                  <div class="option__count">
                    <button class="close__option__Btn" data-option-id="${
                      selectedOption.optionId
                    }"><img src="/src/assets/icon-delete.svg" /></button>
                    <h3 class="option__title">${selectedOption.optionName}</h3>
                    <div class="option__price__container">
                      <div class="option__count__container" data-count-id="${selectedOption.optionId}">
                        <button id="option__minus__btn">
                          <img class="minus" src="/src/assets/icon-minus-line.svg" />
                        </button>
                        <input type="number" class="option__input__count" min="1" max="${stockCount}" value="${
                        selectedOption.qty
                      }"  data-option-inputid="${selectedOption.optionId}"/>
                        <button id="option__plus__btn">
                          <img class="plus" src="/src/assets/icon-plus-line.svg" />
                        </button>
                      </div>
                      <div>
                        <span class="option__total__price">${
                          discountRate > 0
                            ? ((discountPrice + selectedOption.optionPrice) * selectedOption.qty).toLocaleString(
                                "ko-KR"
                              )
                            : (selectedOption.qty * (price + selectedOption.optionPrice)).toLocaleString("ko-KR")
                        }</span>
                      </div>
                    </div>
                  </div>
                  `
                    )
                    .join("")}
                </div>
                  `
              }
              
            </div>
            <div class="product_stock_btns">
              <button class="submit_btn">바로 구매</button>
              <button class="addCart_btn">
                <img src="/src/assets/icon-shopping-cart.svg" alt="addCartBtn" />
              </button>
            </div>
          
        `;
          this.likedButton(); // 좋아요 버튼 요소 컴포넌트 호출
        } else {
          $buyInput.innerHTML = `
          <div class="product_nostock_btns">
            <button class="submit_btn">품절된 상품입니다.</button>
            <button class="addCart_btn">
              <img src="/src/assets/icon-shopping-cart-white.svg" alt="addCartBtn" />
            </button>
          </div>
        `;
          this.likedButton(); // 좋아요 버튼 요소 컴포넌트 호출
        }
      };

      // 좋아요 버튼 컴포넌트
      const $likedbtn = document.createElement("button");
      $likedbtn.className = "modal_heart_btn";

      this.likedButton = () => {
        if (apiData.stockCount > 0) {
          document.querySelector(".product_stock_btns").appendChild($likedbtn);
        } else {
          document.querySelector(".product_nostock_btns").appendChild($likedbtn);
        }
        $likedbtn.innerHTML = `
          ${
            this.likeState.liked
              ? `<img class="modal_heart_btn_on" src="/src/assets/icon-heart-on.svg" alt="heart_btn_on" />`
              : `<img class="modal_heart_btn_cancel" src="/src/assets/icon-heart.svg" alt="heart_btn" />`
          }
        `;
      };
      this.RenderTopInfo();

      // 상품 번호, 상품 수량, 상품 상세 페이지 정보를 가지고 있는 component
      const $productDesc = document.createElement("div");
      document.querySelector(".modal_content").appendChild($productDesc);
      this.RenderProductDesc = () => {
        $productDesc.className = "product_desc";
        $productDesc.innerHTML = `
          <h1 class="name">상품 정보</h1>
          <table>
            <tr>
              <td class="title">상품 번호</td>
              <td class="content">${apiData?.pubDate.replace(/\-/g, "")}</td>
              <td class="title">재고 수량</td>
              <td class="content">${apiData?.stockCount > 0 ? `${apiData?.stockCount}개` : "-"}</td>
            </tr>
          </table>
          ${apiData?.detailInfoImage.map((v) => `<img src=${apiAddr}/${v} />`).join("")}
      `;
      };
      this.RenderProductDesc();

      // event 처리 부분
      const $closeBtn = document.querySelector(".closeBtn");
      $closeBtn.addEventListener("click", () => {
        $modal.remove();
        listRender();
        document.body.style.overflow = "";
      });
      // 모달창에서 X버튼 클릭시 모달창 끄는 이벤트

      $modal.addEventListener("click", (e) => {
        const evTarget = e.target;
        if (evTarget.classList.contains("item_modal")) {
          $modal.remove();
          listRender();
          document.body.style.overflow = "";
        }
      });
      // 모달창에서 모달창 의외에 클릭할때 모달창 끄는 이벤트
    }
  };
  // 반복으로 이벤트를 발생 시킬때 this.render내에 addEventListener가 있으면 느려져서 최상단에 위치 시킴

  $modal.addEventListener("click", (event) => {
    if (event.target.className === "modal_heart_btn_on") {
      if (this.likeState.liked) {
        // this.setState({ ...this.state, liked: false });
        this.setLikeState({ liked: false });
        removeItem(id);
        listRender();
      }
    } else if (event.target.className === "modal_heart_btn_cancel") {
      if (!this.likeState.liked) {
        // this.setState({ ...this.state, liked: true });
        setItem(id, true);
        listRender();
        this.setLikeState({ liked: true });
      }
    }
  });
}
export default ItemDetail;
