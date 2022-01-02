import * as React from 'react'

interface Props {
  message: string
}

function App(props: Props) {
  return (
    <h1>{props.message}</h1>
  )
}

export default App
