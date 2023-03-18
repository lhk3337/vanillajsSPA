function App({ $target, initialState }) {
  let data = initialState;

  const render = () => {
    $target.innerHTML = `
    <div>
      <p>${data.message}</p>
      <button class="btn">Click me!</button>
    </div>`;
  };

  const mount = () => {
    render();
    $target.querySelector(".btn").addEventListener("click", handleClick);
  };

  const handleClick = () => {
    data.message = "Button Clicked";
    render();
  };
  mount();
}

export default App;
