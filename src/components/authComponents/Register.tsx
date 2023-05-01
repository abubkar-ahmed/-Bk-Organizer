import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

interface RegisterProps {
    setShowSignUp : React.Dispatch<React.SetStateAction<boolean>>;
    setShowLogin : React.Dispatch<React.SetStateAction<boolean>>;

}
interface Inputs {
    email : string,
    userName : string,
    pwd:string,
    rPwd:string
}

function Register({setShowSignUp , setShowLogin} : RegisterProps) {

    const {register} = useContext(AuthContext);
    const [inputs , setInputs] = useState<Inputs>({
        email : '',
        userName : '',
        pwd : '',
        rPwd : ''
    });

    const inputHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.target ;
        setInputs((prevInputs) => {
            return {...prevInputs , [name] : value} ;
        })
    }


    const submitHandler = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(inputs.email && inputs.userName && inputs.pwd && inputs.rPwd){
            const response = await register(inputs.email , inputs.userName , inputs.pwd , inputs.rPwd);
            if(response.status){
                toast.success(response.message);
                setShowSignUp(false);
                setShowLogin(true);
            }else{
                toast.error(response.message);
            }

        }else{
            toast.error("All Fields Are Requerd!")
        }
    }

  return (
    <div className="back-drop-container" >
    <div className="control-div" onClick={() => setShowSignUp(false)}></div>
    <div className="inner-container auth">
        <h3>Register</h3>
        <form onSubmit={submitHandler}>
            <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' placeholder='Enter Your Email' value={inputs.email} onChange={inputHandler}/>
            <label htmlFor="userName">Username</label>
            <input type="text" name='userName' id='userName' placeholder='Enter Your Username' value={inputs.userName} onChange={inputHandler}/>
            <label htmlFor="pwd">Password</label>
            <input type="password" name='pwd' id='pwd' placeholder='Enter Your Password' value={inputs.pwd} onChange={inputHandler}/>
            <label htmlFor="rPwd">Repeated Password</label>
            <input type="password" name='rPwd' id='rPwd' placeholder='Enter Repeated Password' value={inputs.rPwd} onChange={inputHandler}/>
            <div className="submit">
                <button>Register</button>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Register