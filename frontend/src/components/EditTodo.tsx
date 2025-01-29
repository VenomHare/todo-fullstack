import { CheckCheck } from 'lucide-react';
import { Task } from '../App';

type Props = {
    task?: Task;
    mode: "create" | "edit" | "view";
    setEditBlock: React.Dispatch<React.SetStateAction<boolean>>;
    deleteTask: (id: string) => void;
    addTask: (title: string, description: string) => Promise<string | -1>;
    setEditMode: React.Dispatch<React.SetStateAction<"view" | "create" | "edit">>;
    setActiveTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
    editTask: (id: string, title: string, description: string, completed: boolean) => void;
}

const EditTodo: React.FC<Props> = ({ task, mode, setEditBlock, deleteTask, setEditMode, addTask, setActiveTask, editTask }) => {

    const onCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const title = (e.currentTarget[0] as HTMLInputElement).value;
        const description = (e.currentTarget[1] as HTMLTextAreaElement).value;

        if (title && description) {
            const id = addTask(title, description).toString();
            if (id) {
                setActiveTask({ id, title, description, completed: false });
                setEditMode("view");
            }
        }

    }

    return (
        <div className='w-full h-full bg-[#000000b4] absolute top-0 left-0 flex justify-center items-center'>
            <div className="w-[75%] h-[75%] bg-slate-950 rounded-2xl p-3 ">
                {
                    mode == "create" && (<form className='w-full h-full flex flex-col items-center gap-3' onSubmit={onCreateTask}>
                        <h1 className='text-5xl font-poppins text-white'>Create Todo</h1>

                        <div>Title</div>
                        <input type="text" className='w-[90%] p-2 rounded text-center outline-0 border-1 border-indigo-300' maxLength={100} required placeholder="Enter Task" />

                        <div>Description</div>
                        <textarea className='w-[90%] min-h-[50%] p-2 rounded text-center outline-0 border-1 border-indigo-300' required placeholder="Description" />
                        <div className="flex gap-4 text-xl">
                            <button type='submit' className='p-2 rounded bg-indigo-400 cursor-pointer active:scale-[.99]'>Create Todo</button>
                            <button type="reset" className='p-2 rounded bg-red-800 cursor-pointer active:scale-[.99]' onClick={() => { setEditBlock(false) }} >Close</button>
                        </div>
                    </form>)
                }
                {
                    mode == "edit" && (<form className='w-full h-full flex flex-col items-center gap-3' onSubmit={(e) => {
                        e.preventDefault();
                        const title = (e.currentTarget[0] as HTMLInputElement).value;
                        const description = (e.currentTarget[1] as HTMLTextAreaElement).value;
                        if (title && description) {
                            editTask(task?.id!, title, description, task?.completed!);
                            setActiveTask({ id: task?.id!, title, description, completed: task?.completed! });
                        }
                    }}>
                        <h1 className='text-5xl font-poppins text-white'>Edit Todo</h1>

                        <div>Title</div>
                        <input type="text" className='w-[90%] p-2 rounded text-center outline-0 border-1 border-indigo-300' maxLength={100} required defaultValue={task?.title} placeholder="Enter Task" />

                        <div>Description</div>
                        <textarea className='w-[90%] min-h-[50%] p-2 rounded text-center outline-0 border-1 border-indigo-300' required placeholder="Description" defaultValue={task?.description} />
                        <div className="flex gap-4 text-xl">
                            <button type='submit' className='p-2 rounded bg-indigo-400 cursor-pointer active:scale-[.99]' >Confirm</button>
                            <button type="reset" className='p-2 rounded bg-red-800 cursor-pointer active:scale-[.99]' onClick={() => { setEditBlock(false) }}>Close</button>
                        </div>
                    </form>)
                }
                {
                    mode == "view" && (<div className='w-full h-full flex flex-col items-center gap-3 relative'>
                        {
                        task?.completed &&
                            <div className="absolute left-5 top-5 flex gap-2 text-2xl bg-green-600 p-2 rounded"><CheckCheck size={32} strokeWidth={1.5} />Completed</div>
                        }

                        <div className='text-sm text-gray-400'>Title</div>
                        <div className='w-[90%] p-2 rounded text-center outline-0 border-0 border-indigo-300'>{task?.title}</div>

                        <div className='text-sm text-gray-400'>Description</div>
                        <div className='w-[90%] min-h-[50%] max-h-[75%] overflow-auto p-2 rounded text-center outline-0 border-0 border-indigo-300'>{task?.description}</div>
                        <div className="flex gap-4 text-xl">
                            {
                                !task?.completed && <>
                                    <button className='p-2 rounded bg-green-400 cursor-pointer active:scale-[.99]' onClick={()=>{ 
                                        editTask(task?.id!, task?.title!, task?.description!, true);
                                        setActiveTask({id:task?.id!, title: task?.title!, description: task?.description!, completed: true});
                                    }}>Mark as Done</button>
                                    <button className='p-2 rounded bg-indigo-400 cursor-pointer active:scale-[.99]' onClick={() => { setEditMode("edit") }}>Edit</button>
                                </>
                            }
                            {

                            }
                            <button className='p-2 rounded bg-red-800 cursor-pointer active:scale-[.99]' onClick={() => { deleteTask(task?.id!); setEditBlock(false) }}>Delete</button>
                            <button className='p-2 rounded bg-indigo-400 cursor-pointer active:scale-[.99]' onClick={() => { setEditBlock(false) }}>Close</button>
                        </div>
                    </div>)
                }
            </div>
        </div>
    )
}

export default EditTodo