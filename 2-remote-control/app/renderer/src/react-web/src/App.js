import logo from './logo.svg';
import './App.css';
import { ipcRenderer } from 'electron';
// const { ipcRenderer } = window.require ? window.require("electron") : {};
function App() {
  if(ipcRenderer) {
    ipcRenderer.send('hello')
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
