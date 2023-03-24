import api from "../../lib/api.js";
function ItemDetail({ $target, id }) {
  const data = async () => {
    console.log(await (await api()).fetchProduct(id));
  };
  data();

  const $modal = document.createElement("div");
  $modal.className = "item_modal";
  $target.appendChild($modal);
  this.render = () => {
    $modal.innerHTML = `
    <div class="modal_content">
      <button class="closeBtn">
        <img src="/src/assets/icon-delete.svg" alt="closeBtn" />
      </button>
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
