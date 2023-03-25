import api from "../../lib/api.js";
function ItemDetail({ $target, id }) {
  this.data = async () => {
    return {
      apiAddr: (await api()).API_ADDR,
      api: await (await api()).fetchProduct(id),
    };
  };

  const $modal = document.createElement("div");
  $modal.className = "item_modal";
  $target.appendChild($modal);
  this.render = async () => {
    const {
      api: { thumbnailImg, pubDate, stockCount, detailInfoImage },
      apiAddr,
    } = await this.data();
    $modal.innerHTML = `
    <div class="modal_container">
      <button class="closeBtn">
      <img src="/src/assets/icon-delete.svg" alt="closeBtn" />
      </button>
      <div class="modal_content">
        <div class="product_top_info">
          <img src=${apiAddr}/${thumbnailImg} alt="thumbnailImg" />
          <div class="product_buy"><span>결제하기</span></div>
        </div>
        <div class="product_desc">
          <h1 class="name">상품 정보</h1>
          <table>
            <tr>
              <td class="title">상품 번호</td>
              <td class="content">${pubDate.replace(/\-/g, "")}</td>
              <td class="title">재고 수량</td>
              <td class="content">${stockCount > 0 ? `${stockCount}개` : "-"}</td>
            </tr>
          </table>
          ${detailInfoImage.map((v) => `<img src=${apiAddr}/${v} />`).join("")}
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
