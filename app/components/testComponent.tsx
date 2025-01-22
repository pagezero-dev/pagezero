import { useState } from "react"

export const TestComponent = () => {
  const [toggle, setToggle] = useState(false)
  return (
    <button onClick={() => setToggle(!toggle)}>{toggle ? "On" : "Off"}</button>
  )
}
