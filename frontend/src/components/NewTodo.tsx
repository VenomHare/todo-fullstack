import { DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import React from 'react'

type Props = {
    addTask: (title: string, description: string, color: string) => Promise<string | -1>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string()
})

const NewTodo: React.FC<Props> = ({ addTask, setOpen }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        addTask(values.title, values.description, "#000").then(() => {
            setOpen(false);
        })
    }

    return (
        <div className=''>
            <DialogHeader>
                <DialogTitle>Create New Todo</DialogTitle>
                <DialogDescription>Enter details for new todo</DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Add Title for Todo" {...field} />
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
                                    <Textarea placeholder="Add your description for Todo" className='max-h-[50svh]' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create Todo</Button>
                </form>
            </Form>

        </div>
    )
}

export default NewTodo