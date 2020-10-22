import React,{useState} from 'react';

//Components
import TextFeild from '../TextFeild/TextFeild';
import Alert from "../Alert/Alert";
import Loading from '../Loading/Loading';
//react router
import {Link} from "react-router-dom";
import { useHistory } from "react-router-dom";

//redux
import {connect} from "react-redux";

import {LoginUser} from "../../Actions/UserActions/UserAction";

//icons
import google from "../../sources/icons/google.svg"
import locked from "../../sources/icons/locked.svg"
import email from "../../sources/icons/email.svg"
import user from "../../sources/icons/user-profile.svg";
import flight from "../../sources/icons/flight.svg";
import back from "../../sources/icons/Back.svg";


//styles
import "./Sign.scss";


  

const Sign = (props) => {
    const {Sign,type} = props;
    let history = useHistory();
    const [registerUserState,setRegisterUserState] = useState({
        fullName:"",
        email:"",
        password:"",
        confirmPassword:""
    });
    const [LoginUserState,setLoginUserState] = useState({
        email:"",
        password:"",
    })
    const [showAlert,setShowAlert] = useState(false); 
    const [AlertType,setAlertType] = useState(true);
    const [message,setMessage] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    const showValue = (name,value) =>{ 
      if(type=== 'register'){
        setRegisterUserState({
              ...registerUserState,
              [name]:value
          });

      }else if(type==="login"){
        setLoginUserState({
             ...LoginUserState,
           [name]:value
         })
         
      }

     
    };
    const SubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if(type==="register"){
            const {fullName,email,password,confirmPassword} = registerUserState;
            if(!fullName || !email || !password || !confirmPassword){
                setIsLoading(false);
                AlertHandler("All items are required");
               
            }
          //  console.log(fullName,email,password,confirmPassword);
        }else if(type==="login"){
            const user = await props.dispatch(LoginUser(LoginUserState));  
            setIsLoading(false);     
            if(user.payload.error){
                return AlertHandler(user.payload.message);
            }else{
            setAlertType(false);
            AlertHandler(user.payload.message);
            setTimeout(() => {
                history.push("/profile");
            }, 2000);
            
            }
            
           
        }
    }

    const AlertHandler = (msg) => {
        setMessage(msg);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false)
        }, 3000);
    }

    const closeHandler = () => {
       
        setShowAlert(false);
      };
    return (
        <div className="sign-container">
        {showAlert ? <Alert type="user" isError={AlertType} err={message} closeError={()=>closeHandler()} /> : null}
        <div className="background">
        <div className="top-back" />
            <img  src={flight}  alt="flight"/>
        </div>
        <div className="user">
        <div className="links">
            <Link to="/">
                <img src={back} alt="back" />
            </Link>
        </div>
        <div className="form-container">
        <h1 className="form-title">{Sign}</h1>
            <form onSubmit={(e)=> SubmitHandler(e)} >
               <button className="sign-btn google" type="submit"><img src={google} alt="google" /></button>
               <div className="or"><span className="line"/> Or<span className="line"/></div>
               {type === "register" ? 
               <>
               
               <TextFeild showValue={showValue} icon={user} name="fullName" type="text" placehodler="Full Name" />
               <TextFeild showValue={showValue} icon={email} name="email" type="email" placehodler="Email" />
               <TextFeild showValue={showValue} icon={locked} name="password" type="password" placehodler="Password" />
               <TextFeild showValue={showValue} icon={locked} name="confirmPassword" type="password" placehodler="Confirm Password" />
               <button  className="sign-btn" type="submit" >Creat An Account</button>
               </> :
                <>
                    <TextFeild showValue={showValue} icon={email} name="email" type="email" placehodler="Email" />
                    <TextFeild showValue={showValue} icon={locked} name="password" type="password" placehodler="Password" />
                    
                    <button className="sign-btn" type="submit" >{isLoading ? <Loading /> :"Sign In"} </button>
                </>
               }
               
            </form>
            <div className="other-user-type">{type === "register" ? "Already have an Account" : "New User" } ? <Link to={type === 'register'?'sign-in' :'sign-up' }>{type}</Link></div>
        </div>
        </div>
        </div>
    );
};


const mapStateToProps = (state) => {
  
   return{
   LoginUser:state.UserReducer.LoginUser
   }
}

export default connect(mapStateToProps)(Sign);