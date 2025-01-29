import mongoose from "mongoose";

const DATABASE_URL="mongodb+srv://admin:WOO5ZxQ5TqI6GOdM@localdevelopment.mkdh9.mongodb.net/"
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
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const TodoUser = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);
export { TodoUser, Todo };