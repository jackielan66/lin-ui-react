import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Button from './components/Button/Button'
import SVG from './components/svg/arrow-down-bold.svg'
import Picker from './components/Picker/index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      count is: {count}
      <Button type="primary" >按钮</Button>
      <div>
        <div style={{height:300}} >
        <Picker onChange={(index)=>{
setCount(index)
        }}/>
        </div>
    
      </div>

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          <iframe src={SVG} >

          </iframe>
         <Button>按钮</Button>
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header> */}
    </div>
  )
}

export default App
