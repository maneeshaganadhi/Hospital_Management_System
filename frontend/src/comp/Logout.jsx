import { use, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Ct from "./Ct.jsx"

const Logout = () => {
  let navigate = useNavigate()
  let obj = useContext(Ct)
  useEffect(() => {
    sessionStorage.removeItem("user")
    obj.updstate({ token: "", uid: "", name: "", role: "" })
    navigate("/login")
  }, [])


  return (
    <div>Logout</div>
  )
}

export default Logout