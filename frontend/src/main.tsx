import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './app/login/page.tsx'
import SignUpPage from './app/signup/page.tsx'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'

const ServerRouter : React.FC = () => {

    const [token, setToken] = useState<string>();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const loctoken = localStorage.getItem("sk00dev_oauth");
        if (loctoken) {
            setToken(loctoken!);
        }
    },[])

    return (<>
        <Toaster richColors />
        <BrowserRouter>
            <Routes>
                <Route index element={<LoginPage token={token} setToken={setToken} loading={loading} setLoading={setLoading}/>}/>
                <Route path='/dashboard' element={<App token={token} setToken={setToken} loading={loading} setLoading={setLoading}/>}/>
                <Route path="/login" element={<LoginPage token={token} setToken={setToken} loading={loading} setLoading={setLoading}/>}/>
                <Route path="/signup" element={<SignUpPage token={token} setToken={setToken} loading={loading} setLoading={setLoading}/>}/>
            </Routes>   
        </BrowserRouter>
    </>)
}

createRoot(document.getElementById('root')!).render(
    <ServerRouter />
)
