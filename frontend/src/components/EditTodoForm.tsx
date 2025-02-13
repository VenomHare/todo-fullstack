import { Task } from '@/App';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string()
})

type Props = {
    todo: Task;
    editTask: (id: string, title: string, description: string, color: string, completed: boolean) => void;
    setOpen : React.Dispatch<React.SetStateAction<boolean>>
}

const EditTodoForm: React.FC<Props> = ({ todo, editTask, setOpen }) => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: todo.title,
            description: todo.description
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        editTask(todo.id, values.title, values.description, todo.color, todo.completed)
        setOpen(false);
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Add Title for Todo" defaultValue={todo.title} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea  placeholder="Add your description for Todo" defaultValue={todo.description} className='max-h-[50svh]' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Confirm</Button>
                </form>
            </Form>
        </>
    )
}

export default EditTodoForm