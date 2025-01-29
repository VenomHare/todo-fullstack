import { Router } from "express";
import { Todo, TodoUser } from "../db";
import jwt from "jsonwebtoken";
import {userMiddleware} from "../middleware/user";

const userRouter = Router();

const JWT_SECRET="aopijkmkd2k3k4k5k6kaamlklkajksndafaf0k"


userRouter.post('/signup',async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return
        }
        const prevUser = await TodoUser.findOne({ username });
        if (prevUser) {
            res.status(400).json({ message: 'User already exists' });
            return
        }
        const user = new TodoUser({ username, password });
        await user.save();
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token });
        return
    }
    catch(err)
    {
        res.status(500).json({ message: 'Error creating user' });
        return
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return
        }
        const user = await TodoUser.findOne({username, password});
        if (!user) {
            res.status(403).json({ message: 'Invalid username or password' });
            return
        }
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token });
        return
    }
    catch(err)
    {
        res.status(500).json({ message: 'Error logging in' });
        return
    }
});

userRouter.get('/todos', userMiddleware ,async (req, res) => {
    try{
        const {username} = req.body;
        const user = await TodoUser.findOne({username}).populate("todos");

        res.json({todos: user?.todos});

    }
    catch(err){
        res.status(500).json({message:"Error while fetching todos"})
    }
});

userRouter.post("/todo",userMiddleware,async (req, res) => {
    try{
        const {title, description, username} = req.body;
        const user = await TodoUser.findOne({username});
        const todo = new Todo({
            title,
            description,
            completed: false,
            user: user?._id
        })
        await todo.save();
        await TodoUser.updateOne({username},{
            "$push":{
                todos: todo._id
            }
        })
        res.json({todoId: todo._id});
    }
    catch(err){
        res.status(500).json({message: "Error while adding todo"});
    }
})

userRouter.get("/todo/:id",userMiddleware, async (req,res)=>{
    try {
        const { id } = req.params;
        const { username} = req.body;
        
        const user = await TodoUser.findOne({username});
        const todo = await Todo.findById(id);
        
        if (!user || !todo)
        {
            res.status(400).json({message: "Todo or User not found"});
        }


        if (!todo?.user?.equals(user?._id))
        {
            res.status(403).json({message:"Unauthorized"});
        }
        

        res.status(200).json({todo});
    }
    catch(err)
    {
        res.status(500).json({message: "Error while updating todo"})
    }
})

userRouter.put("/todo/:id", userMiddleware,async (req, res) => {
    
    try {
        const { id } = req.params;
        const { title, description, completed, username} = req.body;
        
        const user = await TodoUser.findOne({username});
        const todo = await Todo.findById(id);
        
        if (!user || !todo)
        {
            res.status(400).json({message: "Todo or User not found"});
        }


        if (!todo?.user?.equals(user?._id))
        {
            res.status(403).json({message:"Unauthorized"});
        }
        await Todo.updateOne({_id: todo?._id},{
            "$set":{
                title: title,
                description: description,
                completed: completed
            }
        })

        res.status(200).json({message: "Updated Todo"});
    }
    catch(err)
    {
        res.status(500).json({message: "Error while updating todo"})
    }
})

userRouter.delete("/todo/:id",userMiddleware,async (req, res)=>{
    try{
        const { id } = req.params;
        const { username} = req.body;
        
        const user = await TodoUser.findOne({username});
        const todo = await Todo.findById(id);
        
        if (!user || !todo)
        {
            res.status(400).json({message: "Todo or User not found"});
            return;
        }

        if (!todo?.user?.equals(user?._id))
        {
            res.status(403).json({message:"Unauthorized"});
            return;
        }

        await TodoUser.updateOne({username}, {
            "$set":{
                todos: user.todos.filter(m=>!m._id.equals(todo._id)),
            }
        })
        await Todo.findByIdAndDelete(id);

        res.json({message:"Todo Deleted"});

    }
    catch(err)
    {
        res.status(500).json({message:"Something went wrong"});
    }
})
export default userRouter;