function App({ $target }) {
  const render = () => {
    $target.innerHTML = `
    <div>
      <h1>Hello</h1>
      
    </div>`;
  };
  render();
}

export default App;
