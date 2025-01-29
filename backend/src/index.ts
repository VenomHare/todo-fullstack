import express from "express";
import userRouter from "./user/user";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log("BODY: "+JSON.stringify(req.body));
    next();
})
app.use("/user", userRouter);

app.listen(3010, () => {
    console.log('Server is running on port 3010');
});