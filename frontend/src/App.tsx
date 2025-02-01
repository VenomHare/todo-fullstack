import React, { useEffect, useState } from 'react';
import './App.css'
import Block from './components/Block'
import EditTodo from './components/EditTodo';
import { Bounce, toast, ToastContainer } from 'react-toastify';

export type Task = {
  id: string;
  title: string;
  description: string;
  color: string;
  completed: boolean;
}

enum Screens {
  SignUp,
  SignIn,
  Dashboard
}

function App() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [editBlock, setEditBlock] = useState(false);
  const [editMode, setEditMode] = useState<"view" | "create" | "edit">('view');
  const [activetask, setActiveTask] = useState<Task>();
  const [currentScreen, setCurrentScreen] = useState<Screens>(Screens.SignIn);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  
  const ENDPOINT = "https://todosbackend.venomhare.space";

  const addTask = async (title: string, description: string, color: string) => {
    const req = await fetch(`${ENDPOINT}/user/todo`, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        title,
        description,
        color
      })
    })
    const res = await req.json();
    update();
    if (![401, 400, 500].includes(req.status)) {
      return res.todoId as string;
    }
    else {
      fail(res.message);
      return -1
    }
  }

  const deleteTask = async (id: string) => {

    const req = await fetch(`${ENDPOINT}/user/todo/${id}`, {
      method: "DELETE",
      headers: {
        "authorization": `Bearer ${token}`
      }
    })


    const res = await req.json();
    if (![401, 400, 500].includes(req.status)) {
      setEditBlock(false);
      setActiveTask(undefined);
      update();
      success("Todo Deleted");
    }
    else {
      fail(res.message);
    }
  }

  const editTask = async (id: string, title: string, description: string, color:string, completed: boolean) => {
   console.log(color);  
   const req = await fetch(`${ENDPOINT}/user/todo/${id}`,{
      method:"PUT",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        title,
        description,
        completed,
        color
      })
    });

    const res = await req.json();

    if (![401, 400, 500].includes(req.status)) {
      await update();
      setEditMode("view");
      success("Todo Updated");
    }
    else {
      fail(res.message);
    }
  }



  const fail = (s: string) => {
    toast.error(s, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }

  const success = (s: string) => {
    toast.success(s, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const username = (e.currentTarget[0] as HTMLInputElement).value;
    const password = (e.currentTarget[1] as HTMLInputElement).value;

    const req = await fetch(`${ENDPOINT}/user/login`, {
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
    if (req.status == 400) {
      setLoading(false);
    }
    else if (req.status == 403) {
      setLoading(false);
      fail(res.message);
    }
    else if (req.status == 200) {
      localStorage.setItem("sk00dev_oauth", res.token);
      setLoading(false);
      setToken(res.token);
      update(res.token);
      setCurrentScreen(Screens.Dashboard);
    }
  }

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
      fail(res.message);
    }
    else {
      localStorage.setItem("sk00dev_oauth", res.token);
      setLoading(false);
      setToken(res.token);
      update(res.token);
      setCurrentScreen(Screens.Dashboard);
    }
  }
  const update = async (t?: string) => {
    const req = await fetch(`${ENDPOINT}/user/todos`, {
      headers: {
        'authorization': `Bearer ${t ?? token}`
      }
    })
    const res = await req.json();
    if (![401, 400, 500].includes(req.status)) {

      setTasks(res.todos.map((data: any) => {
        return {
          id: data._id,
          title: data.title,
          description: data.description,
          completed: data.completed,
          color: data.color
        }
      }));
    }
    else { 
      fail(res.message);
    }
  }

  //hooks
  useEffect(() => {
    const loctoken = localStorage.getItem("sk00dev_oauth");
    if (loctoken) {
      setCurrentScreen(Screens.Dashboard);
      setToken(loctoken!);
      update(loctoken);
    }
    else {
      setCurrentScreen(Screens.SignIn);
    }
  }, [])

  return (
    <div className='w-full h-screen flex items-center flex-col gap-5 bg-slate-800 font-poppins text-white'>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />

      {
        currentScreen == Screens.Dashboard && <>
          <button className='p-2 rounded bg-indigo-400 cursor-pointer active:scale-[.99]' onClick={()=>{localStorage.removeItem("sk00dev_oauth"); setCurrentScreen(Screens.SignIn)}}>Logout</button>
          <h1 className='text-5xl font-poppins' >Todo App</h1>
          <button className='p-2 rounded bg-indigo-400 cursor-pointer active:scale-[.99]' onClick={() => {
            setEditMode('create');
            setEditBlock(true);
          }}>Add Todo</button>
          <div className="w-[85%] h-[85%] relative overflow-auto gap-2 bg-stone-500 rounded-xl flex flex-wrap justify-center items-start content-start p-2" id="container">
            {editBlock && <EditTodo mode={editMode} task={activetask} setEditBlock={setEditBlock} deleteTask={deleteTask} editTask={editTask} setEditMode={setEditMode} setActiveTask={setActiveTask} addTask={addTask} />}
            {
              tasks.map((task: Task) => (
                <Block task={task} key={task.id} setTask={setActiveTask} setEditBlock={setEditBlock} setEditMode={setEditMode} />
              ))
            }

          </div>
        </>
      }
      {
        currentScreen == Screens.SignIn && <>
          <form className="w-[500px] h-[550px] m-5 rounded-xl bg-zinc-800 flex flex-col items-center justify-around relative overflow-hidden" onSubmit={handleLogin}>
            {
              loading && <>
                <div className="spinnerparent">
                  <div className="spinner"></div>
                </div>
              </>
            }
            <div className="text-4xl font-semibold font-poppins text-center">Welcome Back !!</div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <div className='text-md px-2'>Username</div>
                <input type="text" id="usern" className='w-[450px] bg-zinc-600 outline-0 p-3 rounded' required />
              </div>
              <div className="flex flex-col">
                <div className='text-md px-2'>Password</div>
                <input type="password" id="pass" className='w-[450px] bg-zinc-600 outline-0 p-3 rounded' required />
              </div>
            </div>
            <button type='submit' className='text-2xl w-[450px] rounded-xl py-3 bg-zinc-600 cursor-pointer'>Sign In</button>
            <div className='flex items-center gap-5'>
              <div className='w-[175px] h-[1px] bg-zinc-100'></div>
              <div className=''>or</div>
              <div className='w-[175px] h-[1px] bg-zinc-100'></div>
            </div>
            <button className='text-2xl w-[450px] rounded-xl py-3 bg-zinc-600 cursor-pointer' onClick={() => { setCurrentScreen(Screens.SignUp) }}>Register</button>
          </form>
        </>
      }
      {
        currentScreen == Screens.SignUp && <>
          <form className="w-[500px] h-[550px] relative m-5 rounded-xl bg-zinc-800 flex flex-col items-center justify-around overflow-hidden" onSubmit={handleRegister}>
            {
              loading && <>
                <div className="spinnerparent">
                  <div className="spinner"></div>
                </div>
              </>
            }
            <div className="text-4xl font-semibold font-poppins text-center">Welcome OnBoard !!</div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <div className='text-md px-2'>Username</div>
                <input type="text" id="usern" className='w-[450px] bg-zinc-600 outline-0 p-3 rounded' required />
              </div>
              <div className="flex flex-col">
                <div className='text-md px-2'>Password</div>
                <input type="password" id="pass" className='w-[450px] bg-zinc-600 outline-0 p-3 rounded' required />
              </div>
            </div>
            <button type='submit' className='text-2xl w-[450px] rounded-xl py-3 bg-zinc-600 cursor-pointer'>Register</button>
            <div className='flex items-center gap-5'>
              <div className='w-[175px] h-[1px] bg-zinc-100'></div>
              <div className=''>or</div>
              <div className='w-[175px] h-[1px] bg-zinc-100'></div>
            </div>
            <button className='text-2xl w-[450px] rounded-xl py-3 bg-zinc-600 cursor-pointer' onClick={() => { setCurrentScreen(Screens.SignIn) }}>Sign In</button>
          </form>
        </>
      }
    </div>
  )
}

export default App
