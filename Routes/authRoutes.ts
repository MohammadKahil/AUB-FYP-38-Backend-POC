import express, { Request, Response } from 'express';
import { login, refresh, logout, signup, register } from '../Controllers/authController';
import { loginLimiter } from '../Middlewares/loginLimiter'
import { validate } from '../Middlewares/validationMiddleware';
import { AddUserSchema, RegisterUserSchema } from '../Data/Schemas/userSchema'

const router = express.Router()

router.post("/", loginLimiter, (req:Request , res:Response) => {
    login(req, res);
  });
router.get("/refresh",(req:Request, res: Response)=>{refresh(req,res)})

router.post("/logout",(req:Request, res: Response)=>{logout(req,res)})

router.post("/signup",validate(AddUserSchema),(req:Request, res: Response)=>{signup(req,res)})

router.post("/register", validate(RegisterUserSchema), (req:Request, res: Response)=>{register(req,res)})

module.exports = router