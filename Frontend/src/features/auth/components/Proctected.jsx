import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"

const Proctected = ({children}) => {

    const {loading, user} = useAuth();

    if(loading){
        return ( <main><h1>Loading user profile...</h1></main>)
    }

    if(!user){
        return <Navigate to={"/login"} replace/>
    }

  return children
}
export default Proctected