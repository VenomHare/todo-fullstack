import React, { useEffect, useState } from 'react';
import './App.css'
import { toast } from 'sonner';
import DashboardLayout from './components/layouts/DashboardLayout';
import { Card, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from './components/ui/drawer';
import { Button } from './components/ui/button';
import { SidebarTrigger } from './components/ui/sidebar';
import { Badge } from './components/ui/badge';
import { CheckCheck, CheckCheckIcon, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import EditTodoForm from './components/EditTodoForm';
import { Label } from './components/ui/label';

export type Task = {
  id: string;
  title: string;
  description: string;
  color: string;
  completed: boolean;
}


export const ENDPOINT = "https://todosbackend.venomhare.space";

type Props = {
  token: string | undefined,
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}


const App: React.FC<Props> = ({ token, setToken }) => {

  const [tasks, setTasks] = useState<Task[]>([])

  const [editTodoBool, setEditTodoBool] = useState(false);
  const [username, setUsername] = useState("");



  const addTask = async (title: string, description: string, color: string) => {
    const req = await fetch(`${ENDPOINT}/user/todo`, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
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
      update();
      success("Todo Deleted");
    }
    else {
      fail(res.message);
    }
  }

  const editTask = async (id: string, title: string, description: string, color: string, completed: boolean) => {
    console.log(color);
    const req = await fetch(`${ENDPOINT}/user/todo/${id}`, {
      method: "PUT",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        completed,
        color
      })
    });

    const res = await req.json();

    if (![401, 400, 500].includes(req.status)) {
      await update();
      success("Todo Updated");
    }
    else {
      fail(res.message);
    }
  }



  const fail = (s: string) => {
    toast.error(s, {
      position: "top-center",
    });
  }

  const success = (s: string) => {
    toast.success(s, {
      position: "top-center",
    });
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
  const MarkAsDone = (todo: Task) => {
    editTask(todo.id, todo.title, todo.description, todo.color, true);
  }

  //hooks
  useEffect(() => {
    const loctoken = localStorage.getItem("sk00dev_oauth");
    if (loctoken) {
      setToken(loctoken!);
      fetch(`${ENDPOINT}/user/username`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
          'authorization': `Bearer ${loctoken}`
        }
      }).then((req)=>req.json().then((res)=>{
        console.log(res);
        if (![401, 400, 500].includes(req.status)) {
          setUsername(res.username);
        } 
        else {
          fail(res.message);
        }
      }));
      update(loctoken);
    }
    else {
      window.location.href = "/login";
    }
  }, [])

  return (
    <DashboardLayout addTask={addTask} username={username}>
      <div className='size-full flex flex-col justify-evenly items-start p-4'>
        <div className="w-full flex gap-4 items-center">
          <div>
            <SidebarTrigger />
          </div>
          <h1 className='text-4xl font-semibold mx-5'>Active Todos</h1>
        </div>
        <div className="w-full h-[90%] flex flex-wrap gap-4 max-md:justify-center items-start content-start overflow-x-hidden overflow-y-auto">
          {
            tasks.map(task => <>

              <Drawer>
                <DrawerTrigger>


                  <Card className='max-w-[40svw]'>

                    <CardHeader>
                      <CardTitle className='flex flex-col items-center justify-center gap-2'>
                        {task.completed && <Badge variant="secondary"><CheckCheckIcon />Completed</Badge>}
                        <p>{task.title}</p>
                      </CardTitle>
                      <CardDescription>{task.description.length > 100 ? (
                        <p>
                          {task.description.slice(0, 400).split("\n").map(l => <p>{l}</p>)} <p className='underline'>Read more</p>
                        </p>
                      )
                        :
                        task.description.split("\n").map(l => <p>{l}</p>)
                      }</CardDescription>
                    </CardHeader>
                  </Card>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="h-[75svh] w-full flex flex-col justify-evenly items-center">
                    <DrawerHeader className='flex gap-3 items-center'>
                      <h3 className="text-4xl font-semibold text-center">{task.title}</h3>
                      {
                        task.completed && <Badge variant="secondary"> <CheckCheckIcon /> Completed</Badge>
                      }
                    </DrawerHeader>
                    <div className="text-xl max-w-[90%] overflow-x-hidden overflow-y-auto" >
                      {task.description.split("\n").map(l => <p>{l}</p>)}
                    </div>
                    <div className="flex gap-3 items-center justify-center">

                      {
                        !task.completed && (
                          <>
                            <Dialog open={editTodoBool} onOpenChange={setEditTodoBool}>
                              <DialogTrigger>
                                <Button>Edit</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Todo</DialogTitle>
                                  <DialogDescription >
                                    <p>Enter details to edit</p>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex gap-3 items-center">
                                  <Label htmlFor='todoid'>Todo Id :</Label>
                                  <Badge id="todoid" variant="outline">{task.id}</Badge>
                                </div>
                                <EditTodoForm todo={task} editTask={editTask} setOpen={setEditTodoBool} />
                              </DialogContent>
                            </Dialog>

                          </>
                        )
                      }
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button className='hover:bg-red-900'>Remove</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure you want to delete the todo?</AlertDialogTitle>
                            <AlertDialogDescription className='flex flex-col gap-2 items-start'>
                              <p>This action cannot be undone. This will permanently delete your Todo.</p>
                              <Badge variant="outline">Todo Id: {task.id}</Badge>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <DrawerClose>
                              <AlertDialogAction className='bg-red-900' onClick={() => { deleteTask(task.id) }}><Trash2 />Delete</AlertDialogAction>
                            </DrawerClose>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {
                        !task.completed && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button >Mark As Done</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure you want to Change the todo status?</AlertDialogTitle>
                                  <AlertDialogDescription className='flex flex-col gap-2 items-start'>
                                    <p>The todo will be Marked as Done. This is irreversible action.</p>
                                    <Badge variant="outline">Todo Id: {task.id}</Badge>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <DrawerClose>
                                    <AlertDialogAction onClick={() => { MarkAsDone(task) }}><CheckCheck />Mark as Done</AlertDialogAction>
                                  </DrawerClose>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )
                      }
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </>)
          }

        </div>
      </div>
    </DashboardLayout>
  )
}

export default App
