import React, { useState ,createRef,useEffect,useRef} from 'react'
import logo from './logo.svg'
// import './App.less'
import Button from './components/Button/Button'
// import Picker from './components/Picker/index'
import Icon from './components/Icon/Icon'

const usePrevious = state => {
  const ref = useRef();
  useEffect(()=>{
    // 执行了 useEffect
    console.log(`执行了 useEffect 内面`,state)
    ref.current = state
  })
  console.log(`usePrevious 外面`,state)
  return ref.current;
}


const Test = ()=>{
  console.log('每次都刷新了状态。如果状态有变化，所有函数重写走一波')
  const [renderIndex,setRenderIndex] = React.useState(0);
  const refFromUseRef = useRef();
  const refFromCreateRef = createRef()

  console.log(refFromUseRef,'refFromUseRef')
  console.log(refFromCreateRef,'refFromCreateRef')
 
  const prevCount =  usePrevious(renderIndex)
 

  React.useEffect(()=>{
    console.log('componetan did mount')
  },[])

  if(!refFromUseRef.current){
    refFromUseRef.current = renderIndex;
  }
  if(!refFromCreateRef.current){
    refFromCreateRef.current = renderIndex
  }

  return <>
    <p>current render index {renderIndex}</p>
    <p>current refFromCreateRef { refFromCreateRef.current}</p>
    <p>current refFromUseRef { refFromUseRef.current}</p>
    <p>prevCount{prevCount}</p>
    <button onClick={()=>setRenderIndex(renderIndex+1)} >
      plus
    </button>
  </>
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Icon size="18" type="arrow-down-bold" />
      <Icon size="18"  type="arrow-left-bold" />
    
      {/* <Test /> */}
      {/* count is: {count}
      <Button type="primary" >按钮</Button>
      <div>
        <div style={{height:300}} >
        <Picker onChange={(index)=>{
setCount(index)
        }}/>
        </div>
    
      </div> */}
{/* 
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
        
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
