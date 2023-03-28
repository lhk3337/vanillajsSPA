import api from "../../lib/api.js";
import { getItem, setItem, removeItem } from "../../lib/storage.js";
function ItemDetail({ $target, id, listRender }) {
  this.state = {};

  //상태를 변경 하는 메서드
  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
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

  // 실질적 렌더링이 발생되는 메서드
  this.render = () => {
    const { apiData, apiAddr } = this.state;
    if (!apiData) {
      $modal.innerHTML = `
      <div class="modal_container">
        <button class="closeBtn">
          <img src="/src/assets/icon-delete.svg" alt="closeBtn" /> 
        </button>
        <div class="modal_loading"><h1>Loading...</h1></div>
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
      this.renderTopInfo = () => {
        const $topInfo = document.createElement("div");
        $topInfo.className = "product_top_info";
        document.querySelector(".modal_content").appendChild($topInfo);
        $topInfo.innerHTML = `
        <img class="product_img" src=${apiAddr}/${apiData?.thumbnailImg} alt="thumbnailImg" />
        <div class="product_buy"></div>
      `;

        this.renderBuyInfo();
      };

      // 상품의 이름과 가격 젇보를 표시하는 component
      this.renderBuyInfo = () => {
        const $buyInfo = document.createElement("div");
        $buyInfo.className = "buy_info";
        document.querySelector(".product_buy").appendChild($buyInfo);
        $buyInfo.innerHTML = `
        <span class="buy_name">${apiData?.productName}</span>
        <div class="buy_value">
        ${
          apiData?.discountRate
            ? `<span class="price">${Math.floor(apiData?.price * ((100 - apiData?.discountRate) / 100)).toLocaleString(
                "ko-KR"
              )}</span>원`
            : `<span class="price">${apiData?.price.toLocaleString("ko-KR")}</span>원`
        }
        ${apiData?.discountRate ? `<span class="origin_price">${apiData?.price.toLocaleString("ko-KR")}원</span>` : ""}
        <span class="discount">${apiData?.discountRate > 0 ? `${apiData?.discountRate}%` : ""}</span>
      `;
        this.renderBuyInput();
      };

      // 상품의 갯수 선택, 상품의 옵션 선택, 구매버튼, 좋아요 버튼, 카트 모달버튼을 포함한 component
      this.renderBuyInput = () => {
        const $buyInput = document.createElement("div");
        $buyInput.className = "buy_input";
        document.querySelector(".product_buy").appendChild($buyInput);
        if (apiData?.stockCount > 0) {
          $buyInput.innerHTML = `
          <div class="">
            <div class="product_stock">
              <button class="submit_btn">바로 구매</button>
              <button class="addCart_btn">
                <img src="/src/assets/icon-shopping-cart.svg" alt="addCartBtn" />
              </button>
              <button class="modal_heart_btn">
                ${
                  getItem(apiData?.id, "")
                    ? `<img class="modal_heart_btn_on" src="/src/assets/icon-heart-on.svg" alt="heart_btn_on" />`
                    : `<img class="modal_heart_btn_cancel" src="/src/assets/icon-heart.svg" alt="heart_btn" />`
                }
              </button>
            </div>
          </div>
        `;
        } else {
          $buyInput.innerHTML = `
          <div class="product_nostock">
            <button class="submit_btn">품절된 상품입니다.</button>
            <button class="addCart_btn">
              <img src="/src/assets/icon-shopping-cart-white.svg" alt="addCartBtn" />
            </button>
            <button class="modal_heart_btn">
              ${
                getItem(apiData?.id, "")
                  ? `<img class="modal_heart_btn_on" src="/src/assets/icon-heart-on.svg" alt="heart_btn_on" />`
                  : `<img class="modal_heart_btn_cancel" src="/src/assets/icon-heart.svg" alt="heart_btn" />`
              }
            </button>
          </div>
        `;
        }
      };
      this.renderTopInfo();

      // 상품 번호, 상품 수량, 상품 상세 페이지 정보를 가지고 있는 component
      this.renderProductDesc = () => {
        const $productDesc = document.createElement("div");
        document.querySelector(".modal_content").appendChild($productDesc);
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
      this.renderProductDesc();

      // event 처리 부분
      const $closeBtn = document.querySelector(".closeBtn");
      $closeBtn.addEventListener("click", () => {
        $modal.remove();
        listRender();
        document.body.style.overflow = "auto";
      });
      // 모달창에서 X버튼 클릭시 모달창 끄는 이벤트

      $modal.addEventListener("click", (e) => {
        const evTarget = e.target;
        if (evTarget.classList.contains("item_modal")) {
          $modal.remove();
          listRender();
          document.body.style.overflow = "auto";
        }
      });
      // 모달창에서 모달창 의외에 클릭할때 모달창 끄는 이벤트
    }
  };
  // 반복으로 이벤트를 발생 시킬때 this.render내에 addEventListener가 있으면 느려져서 최상단에 위치 시킴
  $modal.addEventListener("click", (e) => {
    if (e.target.className === "modal_heart_btn_on") {
      removeItem(id);
      this.render();
      listRender();
    } else if (e.target.className === "modal_heart_btn_cancel") {
      setItem(id, true);
      this.render();
      listRender();
    }
  });
}
export default ItemDetail;
