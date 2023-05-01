import React, { useContext, useState } from 'react'
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

interface LoginProps {
    setShowLogin : React.Dispatch<React.SetStateAction<boolean>>
}

interface Inputs {
    email : string,
    pwd:string,
}

function Login({setShowLogin}: LoginProps) {
    const {login} = useContext(AuthContext);
    const [inputs , setInputs] = useState<Inputs>({
        email : '',
        pwd : '',
    });

    const inputHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.target ;
        setInputs((prevInputs) => {
            return {...prevInputs , [name] : value} ;
        })
    }

    const submitHandler = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(inputs.email && inputs.pwd){
            const response = await login(inputs.email, inputs.pwd);
            if(response.status){
                console.log(response.message);
                toast(response.message);
                setShowLogin(false);
            }else{
                toast.error(response.message);
                setInputs(prev => {
                    return {
                        ...prev,
                        pwd : ''
                    }
                })
            }
        }else{
            toast.error("All Fields Are Requerd!")
        }
    }

  return (
    <div className="back-drop-container" >
        <div className="control-div" onClick={() => setShowLogin(false)}></div>
        <div className="inner-container auth">
            <h3>Login</h3>
                <form onSubmit={submitHandler}>
                <label htmlFor="email">Email</label>
                <input type="email" name='email' id='email' placeholder='Enter Your Email' value={inputs.email} onChange={inputHandler}/>
                <label htmlFor="pwd">Password</label>
                <input type="password" name='pwd' id='pwd' placeholder='Enter Your Password' value={inputs.pwd} onChange={inputHandler}/>
                <div className="submit">
                    <button>Login</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login