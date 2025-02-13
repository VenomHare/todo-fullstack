import { ENDPOINT } from "@/App"
import { LoginForm } from "@/components/login-form"
import { SignUpForm } from "@/components/signup-form"
import React from "react"
import { toast } from "sonner"
type Props = {
  token: string|undefined,
  setToken : React.Dispatch<React.SetStateAction<string|undefined>>,
    loading : boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SignUpPage : React.FC<Props>=({token, setToken, loading, setLoading})=> {

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      const username = (e.currentTarget[0] as HTMLInputElement).value;
      const password = (e.currentTarget[1] as HTMLInputElement).value;
  
      const req = await fetch(`${ENDPOINT}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });
  
      const res = await req.json();
      if (req.status !== 200) {
        setLoading(false);
        toast.error("Error",{
          description: res.message,
          position: 'top-center',
        });
      }
      else {
        localStorage.setItem("sk00dev_oauth", res.token);
        setLoading(false);
        setToken(res.token);
        window.location.href= "/dashboard";
      }
    }

  return (
    <div className=" flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm handleRegister={handleRegister}/>
      </div>
    </div>
  )
}
export default SignUpPage