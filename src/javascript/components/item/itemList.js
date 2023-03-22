function ItemList({ $main, data }) {
  const render = async () => {
    const datas = await data;
    $main.innerHTML = `
          <ul class="product_container">
              ${datas
                .map((value, i) => {
                  return `
                <li class="product_list" key=${i}>
                  <img class="product_img" src=http://211.243.164.209:5000/${value.thumbnailImg} alt="thumbnailImg" />
                  <div class="product_content">
                    <div class="product_title">
                      <span>${
                        value.productName.length < 30 ? value.productName : value.productName.substring(0, 25)
                      }</span>
                      <button class="heart_btn" />
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
          <beutton class="cart__btn"><img src="/src/assets/cart-btn.svg"></beutton>
        `;
  };
  return render();
}
export default ItemList;
