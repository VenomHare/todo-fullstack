import mongoose from "mongoose";

//DATABASE URL HERE
const DATABASE_URL=process.env.MONGO_URL || "";
mongoose.connect(DATABASE_URL);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]
});

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    color: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const TodoUser = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);
export { TodoUser, Todo };