import { useState } from 'react'

function HOOK_NAME () {
  const [state, setState] = useState(0)

  const changeState = (argument) => setState(argument)

  return {
    state,
    changeState
  }
}

export default HOOK_NAME
