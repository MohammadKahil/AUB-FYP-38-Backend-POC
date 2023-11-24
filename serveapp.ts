import express, { Express, Request, Response } from 'express';

import cookieParser from 'cookie-parser';
const cors = require("cors")

const app: Express = express();

app.use(express.json())
app.use(cookieParser())
const domainsFromEnv = process.env.CORS_DOMAINS || ""

const whitelist = ["http://frontend:3000"]

app.use(cors());
app.options('*', cors());
const userRouter = require("./Routes/userRoutes");
const authRouter = require("./Routes/authRoutes");
const jobRouter = require("./Routes/jobRoutes");
app.use("/api/users", userRouter)
app.use('/api/auth', authRouter)
app.use('/api/jobs', jobRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.all('*', (req,res)=>{
  res.status(404).send({type:"PageNotFound", message:"The page you're trying to reach is no longer available"});
})

module.exports = app;       