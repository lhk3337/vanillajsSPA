import api from "../../lib/api.js";
import { routeChange } from "../../lib/router.js";
import { getItem, setItem, removeItem } from "../../lib/storage.js";
function ItemDetail({ $target, id, listRender }) {
  this.state = { apiAddr: null, apiData: null };
  this.likeState = { liked: Boolean(getItem(id, "")) };
  this.noOptionState = {
    countValue: 1,
    totalvalue: 0,
  };
  this.optionState = {
    optionValue: [],
  };

  //상태를 변경 하는 메서드
  this.setState = (nextState) => {
    this.state = nextState;
    this.Render();
  };

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
    this.setOptionState({ id: apiData.id, ...this.optionState });
    this.setNoOptionState({ ...this.noOptionState, id: apiData.id, totalvalue: apiData.price });
  };

  this.setNoOptionState = (nextState) => {
    this.noOptionState = nextState;
    this.noOptionTotalCount();
  };

  this.setOptionState = (nextState) => {
    this.optionState = nextState;
    this.OptionCount();
    this.optionTotalCount();
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
          if (Array.isArray(apiData.option) && apiData.option.length === 0) {
            $buyInput.innerHTML = `
            <div class="count_input_container"></div>
            <div class="total_price_container price_container"></div>
            <div class="product_stock_btns">
              <button class="submit_btn">바로 구매</button>
              <button class="addCart_btn">
                <img src="/src/assets/icon-shopping-cart.svg" alt="addCartBtn" />
              </button>
              <div class="add__cart__container">
                <span class="triangle"></span>
                <h1>장바구니에 추가되었습니다.</h1>
                <button class="go__cart__btn">장바구니 가기</button>
                <button class="continue__btn">계속 쇼핑 하기</button>
              </div>
            </div>
        `;
            this.noOptionCount();
            this.noOptionTotalCount();
          } else {
            $buyInput.innerHTML = `
            <div class="option_input_container"></div>
            <div class="option_total_price_container price_container"></div>
            <div class="product_stock_btns">
              <button class="submit_btn">바로 구매</button>
              <button class="addCart_btn">
                <img src="/src/assets/icon-shopping-cart.svg" alt="addCartBtn" />
              </button>
              <div class="add__cart__container">
                <span class="triangle"></span>
                <h1>장바구니에 추가되었습니다.</h1>
                <button class="go__cart__btn">장바구니 가기</button>
                <button class="continue__btn">계속 쇼핑 하기</button>
              </div>
            </div>
        `;
            this.selectedOption();
            this.OptionCount();
            this.optionTotalCount();
          }
          this.likedButton(); // TODO 좋아요 버튼 요소 컴포넌트 호출
        } else {
          // * 품절된 상품 버튼 비활성화
          $buyInput.innerHTML = `
          <div class="product_nostock_btns">
            <button class="submit_btn">품절된 상품입니다.</button>
            <button class="addCart_btn">
              <img src="/src/assets/icon-shopping-cart-white.svg" alt="addCartBtn" />
            </button>
          </div>
        `;
          this.likedButton(); // TODO 좋아요 버튼 요소 컴포넌트 호출
        }
      };

      const $option__container = document.createElement("div");
      const $counter = document.createElement("div");
      $counter.className = "count__number_container";
      $option__container.className = "option__container";

      // option이 없을 경우 Count 컴포넌트
      this.noOptionCount = () => {
        document.querySelector(".count_input_container").appendChild($counter);
        $counter.innerHTML = `
          <div class="number_count_input_container">
            <button class="minBtn"><img src="/src/assets/minus-icon-bg-white.svg" alt="minusCount" /></button>
            <input class="numberCount" type="number" value="1" min="1" max=${apiData?.stockCount} />
            <button class="plusBtn"><img src="/src/assets/plus-icon-bg-white.svg" alt="plusCount" /></button>
          </div>`;
      };

      // 옵션 없는 총 상품 금액 표시 컴포넌트
      this.noOptionTotalCount = () => {
        if (document.querySelector(".total_price_container")) {
          document.querySelector(".total_price_container").innerHTML = `
          <h1>총 상품 금액</h1>
          <div class="total_price_info">
          <span class="count_text">총 수량 <span class="count_number">${this.noOptionState.countValue}</span>개</span>
          <span class="total_price_count">${this.noOptionState.totalvalue.toLocaleString("ko-KR")}</span>원
          </div>
          `;
        }
      };

      // option Count 컴포넌트
      this.selectedOption = () => {
        if (document.querySelector(".option_input_container")) {
          document.querySelector(".option_input_container").appendChild($option__container);
          $option__container.innerHTML = `
          <div class="select-box">
            <button class="toggle-btn">옵션을 선택하세요</button>
            <ul class="select-box-option">
            ${apiData.option
              .map((v) => {
                if (v.additionalFee > 0) {
                  return `<li><button class="option-btn" data-option-id=${v.id}>${v.optionName}(+${v.additionalFee}원)</button></li>`;
                } else {
                  return `<li><button class="option-btn" data-option-id=${v.id}>${v.optionName}</button></li>`;
                }
              })
              .join("")}
            </ul>
          </div>
            `;
        }
      };

      const $selectedContainer = document.createElement("div");
      $selectedContainer.className = "selected_container";

      // 옵션 선택시 정보 및 카운트 input 표시되는 컴포넌트
      this.OptionCount = () => {
        if (document.querySelector(".option_input_container")) {
          document.querySelector(".option_input_container").appendChild($selectedContainer);
          if (this.optionState.optionValue) {
            $selectedContainer.innerHTML = `
          ${this.optionState.optionValue
            .map(
              (v) => `
              <div class="selected_option" data-option-id="${v.id}">
                <h1>${v.optionName}</h1>
                <button class="closeOption" data-selected-id="${v.id}">
                  <img src="/src/assets/icon-delete.svg" alt="closeOptionButton" /> 
                </button>
                <div class="option_info">
                  <div class="option_count_input_container">
                    <button class="option_minBtn">
                      <img id="minBtn_img" src="/src/assets/minus-icon-bg-white.svg" alt="minusCount" />
                    </button>
                    <input class="option_numberCount" type="number" value=${v.countValue} min="1" max=${
                apiData?.stockCount
              } />
                    <button class="option_plusBtn">
                      <img id="plusBtn_img" src="/src/assets/plus-icon-bg-white.svg" alt="plusCount" />
                    </button>
                  </div>
                  <span class="option_price" data-optionprice-id="${v.id}">${(v.price * v.countValue).toLocaleString(
                "ko-KR"
              )}원</span>
                </div>
              </div>
            `
            )
            .join("")}
        `;
          }
        }
      };

      this.optionTotalCount = () => {
        if (document.querySelector(".option_total_price_container")) {
          document.querySelector(".option_total_price_container").innerHTML = `
          <h1>총 상품 금액</h1>
          <div class="total_price_info">
          <span class="count_text">총 수량 <span class="count_number">${this.optionState.optionValue.reduce(
            (a, b) => a + b.countValue,
            0
          )}</span>개</span>
          <span class="total_price_count">${this.optionState.optionValue
            .reduce((a, b) => a + b.totalPrice, 0)
            .toLocaleString("ko-KR")}</span>원
          </div>
          `;
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

      // ! 이벤트 처리 부분
      // * 모달창에서 X버튼 클릭시 모달창 끄는 이벤트
      const $closeBtn = document.querySelector(".closeBtn");
      $closeBtn.addEventListener("click", () => {
        $modal.remove();
        listRender();
        document.body.style.overflow = "";
      });

      // * 모달창에서 모달창 의외에 클릭할때 모달창 끄는 이벤트
      $modal.addEventListener("click", (e) => {
        const evTarget = e.target;
        if (evTarget.classList.contains("item_modal")) {
          $modal.remove();
          listRender();
          document.body.style.overflow = "";
        }
      });

      // * option이 없는 경우 수량 카운트 input number handler
      const $number_count_input_container = document.querySelector(".buy_input");

      const $numberCount = document.querySelector(".numberCount");
      $number_count_input_container.addEventListener("click", (event) => {
        const target = event.target;

        const $minBtn = target.closest(".minBtn");
        const $plusBtn = target.closest(".plusBtn");

        if ($minBtn) {
          let value = $numberCount.value;
          value--;
          if (value > 0) {
            $numberCount.value = value;
            this.setNoOptionState({ countValue: value, totalvalue: value * apiData.price });
          }
        }
        if ($plusBtn) {
          let value = $numberCount.value;
          if (value < apiData?.stockCount) {
            value++;
          }
          $numberCount.value = value;
          this.setNoOptionState({ countValue: value, totalvalue: value * apiData.price });
        }
      });

      if ($numberCount) {
        $numberCount.onkeydown = (e) => {
          // TODO 숫자, 백스페이스, 위아래 화살표 키 설정하기 (양수만 입력 가능)
          if (
            !(
              (e.keyCode > 95 && e.keyCode < 106) ||
              (e.keyCode > 47 && e.keyCode < 58) ||
              e.keyCode == 8 ||
              e.keyCode == 38 ||
              e.keyCode == 40
            )
          ) {
            return false;
          }
        };

        $numberCount.addEventListener("input", (e) => {
          const lengths = apiData?.stockCount;
          if (e.target.value > lengths) {
            e.target.value = lengths;
          }
          this.setNoOptionState({
            countValue: e.target.value,
            totalvalue: apiData.discountRate
              ? Math.floor(apiData?.price * ((100 - apiData?.discountRate) / 100)) * e.target.value
              : e.target.value * apiData.price,
          });
        });
      }

      // * option button 클릭 이벤트
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

      // * 옵션 선택 버튼과 해당 옵션 리스트 클릭 시, 수량 및 가격 표시하는 옵션 박스 표시하기

      const $optionSelectBtn = document.querySelectorAll(".option-btn");

      if ($optionSelectBtn) {
        $optionSelectBtn.forEach((element) => {
          const {
            dataset: { optionId },
          } = element;
          element.addEventListener("click", () => {
            const optionClickItem = apiData.option.find((v) => v.id === +optionId);
            const selectedItem = this.optionState.optionValue.find((v) => v.id === +optionId);
            const { id, optionName, additionalFee } = optionClickItem;

            if (optionClickItem && !selectedItem) {
              // TODO 옵션 메뉴클릭하면 this.optionState.optionValue에 apiData.option 데이터 업데이트 하도록 설정
              this.setOptionState({
                ...this.optionState,
                optionValue: [
                  ...this.optionState.optionValue,
                  {
                    id,
                    optionName,
                    additionalFee,
                    price: apiData.discountRate
                      ? Math.floor(apiData?.price * ((100 - apiData?.discountRate) / 100)) + additionalFee
                      : apiData.price + additionalFee,
                    countValue: 1,
                    // TODO totalPrice price로 초기화
                    totalPrice: apiData.discountRate
                      ? Math.floor(apiData?.price * ((100 - apiData?.discountRate) / 100)) + additionalFee
                      : apiData.price + additionalFee,
                  },
                ],
              });
            }
          });
        });
      }

      // * 옵션이 있는 수량 카운트 input number handler
      $selectedContainer.addEventListener("click", (event) => {
        const $options = event.target.closest(".selected_option");
        if ($options) {
          if (event.target.closest(".option_minBtn")) {
            const input = $options.querySelector(".option_numberCount");
            let value = input.value;
            value--;
            if (value > 0) {
              input.value = value;
              this.optionState.optionValue.map((v) => {
                if (v.id === +$options.dataset.optionId) {
                  v.countValue = value;
                  v.totalPrice = v.price * v.countValue;
                }
                this.OptionCount();
                this.optionTotalCount();
              });
            }
          } else if (event.target.closest(".option_plusBtn")) {
            const input = $options.querySelector(".option_numberCount");
            const maxValue = parseInt(input.getAttribute("max"));
            let value = input.value;
            if (value < maxValue) {
              value++;
            }
            input.value = value;
            this.optionState.optionValue.map((v) => {
              if (v.id === +$options.dataset.optionId) {
                v.countValue = value;
                v.totalPrice = v.price * v.countValue;
              }
              this.OptionCount();
              this.optionTotalCount();
            });
          }
        }
      });

      // * 옵션이 있는 input number input 설정하기
      $selectedContainer.addEventListener("input", (event) => {
        const $options = event.target.closest(".selected_option");
        if ($options) {
          const input = event.target.closest(".option_numberCount");
          if (input) {
            const lengths = apiData?.stockCount;
            if (input.value === "") {
              input.value = 0;
            }
            if (input.value > lengths) {
              input.value = lengths;
            }
            this.optionState.optionValue.map((v) => {
              if (v.id === +$options.dataset.optionId) {
                v.countValue = parseInt(input.value);
                v.totalPrice = v.price * v.countValue;
                // TODO : optionValue의 데이터를 변경하면 option_price 요소만 업데이트

                document.querySelectorAll(".option_price").forEach((value) => {
                  if (parseInt(value.dataset.optionpriceId) === v.id) {
                    value.innerText = `${(v.price * v.countValue).toLocaleString("ko-KR")}원`;
                  }
                });
                this.optionTotalCount();
              }
            });
          }
        }
      });

      // * 옵션이 있는 input number 숫자 이외에 입력 금지 설정
      $selectedContainer.addEventListener("keydown", (event) => {
        const $options = event.target.closest(".selected_option");
        if ($options) {
          const input = $options.querySelector(".option_numberCount");
          if (input) {
            input.onkeydown = (e) => {
              // TODO 숫자, 백스페이스, 위아래 화살표 키 설정하기 (양수만 입력 가능)
              if (
                !(
                  (e.keyCode > 95 && e.keyCode < 106) ||
                  (e.keyCode > 47 && e.keyCode < 58) ||
                  e.keyCode == 8 ||
                  e.keyCode == 38 ||
                  e.keyCode == 40
                )
              ) {
                return false;
              }
            };
          }
        }
      });

      // * 동적으로 생성된 요소에 이벤트 설정하기, 해당 옵션 박스의 X버튼 클릭 시 옵션 박스 삭제
      $selectedContainer.addEventListener("click", (event) => {
        // TODO : 정적인 요소인 부모 요소를 이벤트에 등록(이벤트 위임)
        const target = event.target;
        const closeOptionButtonElement = target.closest(".closeOption");
        if (closeOptionButtonElement) {
          const {
            dataset: { selectedId },
          } = closeOptionButtonElement;
          this.setOptionState({
            ...this.optionState,
            optionValue: this.optionState.optionValue.filter((v) => v.id !== +selectedId),
          });
        }
      });

      // * 바로 구매 클릭 이벤트 설정하기
      const $submitBtn = document.querySelector(".submit_btn");
      $submitBtn.addEventListener("click", () => {
        let cartData = getItem("product_carts", []);
        const { productName, price, discountRate, thumbnailImg, shippingFee, id } = apiData;
        if (apiData.option.length !== 0) {
          if (!this.optionState.optionValue.length) {
            alert("옵션을 선택해주세요");
            // TODO 구매하기 클릭할때 옵션을 선택하지 않을 경우 alert 표시
          } else {
            const resultData = { productName, price, discountRate, thumbnailImg, shippingFee, ...this.optionState };
            if (cartData) {
              let duplicated = false;
              cartData.forEach((item) => {
                if (item.id === resultData.id) {
                  for (let newOption of resultData.optionValue) {
                    let savedOption = item.optionValue.find((option) => option.id === newOption.id);
                    // TODO 해당 localStorage의 optionValue의 id와 추가할 데이터의 optionValue id가 같은 해당 localStorage의 optionValue를 찾음
                    if (savedOption) {
                      /**
                       * TODO savedOption가 있으면 localStorage optionValue의 countValue와 totalPrice는 추가할 데이터의 optionValue의 countValue와 totalPrice와 더함
                       **/
                      savedOption.countValue += newOption.countValue;
                      savedOption.totalPrice += newOption.totalPrice;
                    } else {
                      // TODO savedOption가 없으면 해당 cartData optionValue 배열에 result optionValue항목을 push한다.
                      item.optionValue.push(newOption);
                    }
                    duplicated = true;
                  }
                }
              });
              if (!duplicated) {
                // TODO  cartData 요소가 중복 되지 않으면 resultData를 push한다.
                cartData.push(resultData);
              }
            } else {
              // TODO localStorage에 product_carts가 없으면 cartData에 resultData를 배열 형태로 저장
              cartData = [resultData];
            }
            // TODO cartData를 setItem하기
            setItem("product_carts", cartData);
            closeModalMoveRoute("/cart");
            // TODO 옵션 선택 한 제품의 데이터(this.optionState)를 localStorage에 product_carts 키 형식으로 저장하고, /cart 페이지로 이동
          }
          // console.log(this.optionState);
        } else {
          const resultData = { productName, price, discountRate, thumbnailImg, shippingFee, id, ...this.noOptionState };
          setItem("product_carts", cartData.concat(resultData));
          closeModalMoveRoute("/cart");
          // TODO 옵션 선택 없는 제품의 데이터(this.noOptionState)를 localStorage에 product_carts 키 형식으로 저장하고, /cart 페이지로 이동
          // console.log(this.noOptionState);
        }
      });

      // * cart button Event handler
      const $addCart_btn = document.querySelector(".addCart_btn");
      const $add__cart__container = document.querySelector(".add__cart__container");
      const $goCartBtn = document.querySelector(".go__cart__btn");
      const $continueCartBtn = document.querySelector(".continue__btn");

      if (apiData.stockCount > 0) {
        $addCart_btn.addEventListener("click", (event) => {
          event.stopPropagation();
          let cartData = getItem("product_carts", []);
          const { productName, price, discountRate, thumbnailImg, shippingFee } = apiData;
          if (apiData.option.length !== 0) {
            if (!this.optionState.optionValue.length) {
              alert("옵션을 선택해주세요");
              // TODO 구매하기 클릭할때 옵션을 선택하지 않을 경우 alert 표시
            } else {
              const resultData = { productName, price, discountRate, thumbnailImg, shippingFee, ...this.optionState };
              if (cartData) {
                let duplicated = false;
                cartData.forEach((item) => {
                  if (item.id === resultData.id) {
                    for (let newOption of resultData.optionValue) {
                      let savedOption = item.optionValue.find((option) => option.id === newOption.id);
                      if (savedOption) {
                        savedOption.countValue += newOption.countValue;
                        savedOption.totalPrice += newOption.totalPrice;
                      } else {
                        item.optionValue.push(newOption);
                      }
                      duplicated = true;
                    }
                  }
                });
                if (!duplicated) {
                  cartData.push(resultData);
                }
              } else {
                cartData = [resultData];
              }
              $add__cart__container.style.display = "flex";
              setItem("product_carts", cartData);
            }
          } else {
            const resultData = { productName, price, discountRate, thumbnailImg, shippingFee, ...this.noOptionState };
            $add__cart__container.style.display = "flex";
            setItem("product_carts", cartData.concat(resultData));
          }
        });

        // * 장바구니 가기 버튼 클릭 handler
        $goCartBtn.addEventListener("click", () => {
          $add__cart__container.remove();
          closeModalMoveRoute("/cart");
          // TODO closeModalMoveRoute함수를 이용하여 cart 경로로 이동하기
        });

        // * 계속 쇼핑하기 버튼 클릭 handler
        $continueCartBtn.addEventListener("click", () => {
          $add__cart__container.remove();
          closeModalMoveRoute("/");
        });

        // * 장바구니 모달 이외에 클릭 시 닫기
        document.addEventListener("click", (event) => {
          // TODO add cart 모달 창 이외를 클릭했을 때 add cart 모달 창 닫기
          if (!$add__cart__container.contains(event.target)) {
            $add__cart__container.style.display = "none";
          }
        });
      }
    }
    // * 모달 창 닫기 설정과 페이지 이동 함수
    const closeModalMoveRoute = (routeUrl) => {
      routeChange(routeUrl);
      $modal.remove();
      document.body.style.overflow = "";
      /**
       * TODO 해당하는 routeURL 경로로 이동,
       * TODO 모달창이 열리면 메인 페이지의 스크롤을 고정하기 위해 overflow를 hidden 설정하였는데,
       * TODO 모달창을 닫으면서 메인 페이지의 스크롤 고정을 해지 하기 위해 document.body.style.overflow = ""; 설정
       **/
    };
  };

  // ! 반복으로 이벤트를 발생 시킬때 this.render내에 addEventListener가 있으면 느려지는 원인으로 하트 좋아요 이벤트 설정을 최상단에 위치 시킴
  $modal.addEventListener("click", (event) => {
    if (event.target.className === "modal_heart_btn_on") {
      if (this.likeState.liked) {
        this.setLikeState({ liked: false });
        removeItem(id);
        listRender();
      }
    } else if (event.target.className === "modal_heart_btn_cancel") {
      if (!this.likeState.liked) {
        setItem(id, true);
        listRender();
        this.setLikeState({ liked: true });
      }
    }
  });
}
export default ItemDetail;
