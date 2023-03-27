import api from "../../lib/api.js";
function ItemDetail({ $target, id }) {
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
  this.render = async () => {
    if (this.state.apiData === null) {
      return ($modal.innerHTML = `
    <div class="modal_container">페이지를 찾을 수 없습니다.</div>
    `);
    }
    const { apiData, apiAddr } = this.state;

    $modal.innerHTML = `
    <div class="modal_container">
      <button class="closeBtn">
      <img src="/src/assets/icon-delete.svg" alt="closeBtn" />
      </button>
      <div class="modal_content">
        <div class="product_top_info">
          <img src=${apiAddr}/${apiData?.thumbnailImg} alt="thumbnailImg" />
          <div class="product_buy">
            <div class="buy_info">
              <span class="buy_name">${apiData?.productName}</span>
              <div class="buy_value">
              ${
                apiData?.discountRate
                  ? `<span class="price">${Math.floor(
                      apiData?.price * ((100 - apiData?.discountRate) / 100)
                    ).toLocaleString("ko-KR")}</span>원`
                  : `<span class="price">${apiData?.price.toLocaleString("ko-KR")}</span>원`
              }
              ${
                apiData?.discountRate
                  ? `<span class="origin_price">${apiData?.price.toLocaleString("ko-KR")}원</span>`
                  : ""
              }
                <span class="discount">${apiData?.discountRate > 0 ? `${apiData?.discountRate}%` : ""}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="product_desc">
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
        </div>
      </div>
    </div>`;

    $modal.querySelector(".closeBtn").addEventListener("click", () => {
      $modal.remove();
      document.body.style.overflow = "auto";
    });
    // 모달창에서 X버튼 클릭시 모달창 끄는 이벤트

    $modal.addEventListener("click", (e) => {
      const evTarget = e.target;
      if (evTarget.classList.contains("item_modal")) {
        $modal.remove();
        document.body.style.overflow = "auto";
      }
    });
    // 모달창에서 모달창 의외에 클릭할때 모달창 끄는 이벤트
  };
}
export default ItemDetail;
