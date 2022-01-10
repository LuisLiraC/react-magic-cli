const CONTENT = {
  javascript: {
    app: {
      noRouting: `
function App (props) {
  return (
    <h1>Hello World</h1>
  )
}

export default App`,
      withRouting: `
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Link to='/about'>About</Link>
    </div>
  )
}

export function About() {
  return (
    <div>
      <h1>About Works</h1>
      <Link to='/'>Home</Link>
    </div>
  )
}`
    },
    index: {
      noRouting: `
import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './components/App'
STYLES_IMPORT

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)`,
      withRouting: `
import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
STYLES_IMPORT

import App, { About } from './components/App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='about' element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
  rootElement
)`
    }
  },
  typescript: {
    app: {
      noRouting: `
interface Props {
  message: string
}

function App(props: Props) {
  return (
    <h1>{props.message}</h1>
  )
}

export default App`,
      withRouting: `
import { Link } from 'react-router-dom'

interface Props {
  message: string
}

export default function App(props: Props) {
  return (
    <div>
      <h1>{props.message}</h1>
      <Link to='/about'>About</Link>
    </div>
  )
}

export function About() {
  return (
    <div>
      <h1>About Works</h1>
      <Link to='/'>Home</Link>
    </div>
  )
}`
    },
    index: {
      noRouting: `
import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './components/App'
STYLES_IMPORT

render(
  <StrictMode>
    <App message='Hello World' />
  </StrictMode>,
  document.getElementById('root')
)`,
      withRouting: `
import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
STYLES_IMPORT

import App, { About } from './components/App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App message='Hello World' />} />
        <Route path='about' element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
  rootElement
)`
    }
  }
}

function getIndexContent (language, routing) {
  return routing
    ? CONTENT[language].index.withRouting
    : CONTENT[language].index.noRouting
}

function getAppContent (language, routing) {
  return routing
    ? CONTENT[language].app.withRouting
    : CONTENT[language].app.noRouting
}

module.exports = {
  getAppContent,
  getIndexContent
}
