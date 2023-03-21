function ItemList({ $target, data }) {
  const render = async () => {
    const datas = await data;
    $target.innerHTML = `
        <main>
          <div class="product_container">
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
                      <span class="price">${value.price}</span>원
                      <span class="discount">${value.discountRate > 0 ? `${value.discountRate}%` : ""}</span>
                    </div>
                  </div>
                </li>
                `;
              })
              .join("")}
          </div>
        </main>`;
  };
  return render();
}
export default ItemList;
