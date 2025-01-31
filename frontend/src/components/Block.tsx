import React from 'react'
import { Task } from '../App';

type Props = {
    task: Task;
    setTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
    setEditBlock: React.Dispatch<React.SetStateAction<boolean>>;
    setEditMode: React.Dispatch<React.SetStateAction<"view" | "create" | "edit">>;
}

const Block: React.FC<Props> = ({ task, setTask, setEditBlock, setEditMode }) => {
    return (<>
        {
            task.completed ?
                <>
                    <div className='min-w-[25svw] max-w-[90%] min-h-[10svh] p-3 rounded-lg bg-neutral-600 cursor-pointer flex items-center justify-around' onClick={() => {
                        setTask(task);
                        setEditMode('view');
                        setEditBlock(true);
                    }}>

                        <div className='font-poppins font-white text-2xl max-w-[85%] line-through'>{task.title}</div>
                    </div>
                </>
                :
                <div className='min-w-[25svw] max-w-[90%] min-h-[10svh] p-3 rounded-lg bg-yellow-500 cursor-pointer flex items-center justify-around' style={{backgroundColor: task?.color||"#f0b100"}} onClick={() => {
                    setTask(task);
                    setEditMode('view');
                    setEditBlock(true);
                }}>

                    <div className='font-poppins font-white text-2xl max-w-[85%]'>{task.title}</div>
                </div>
        }

    </>
    )
}

export default Block