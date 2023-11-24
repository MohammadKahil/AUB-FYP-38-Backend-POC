import express, { Request, Response } from 'express';
import { validate } from '../Middlewares/validationMiddleware';
import { GetUserListSchema, GetUserSchema, EditUserSchema, DeleteUserSchema } from '../Data/Schemas/userSchema';
import { AddUserController, GetUserController, GetUserListController, UpdateUserController, DeleteUserController } from '../Controllers/userController';
import { verifyJWT } from '../Middlewares/verifyJWT';

const router = express.Router()
router.use(verifyJWT)


  router.get("/", validate(GetUserListSchema),(req:Request , res:Response) => {
    GetUserListController(req, res);
  });
  
  router
    .route("/:id")
    .get(validate(GetUserSchema), (req, res) => {
        GetUserController(req, res);
    })
    .patch(validate(EditUserSchema),(req, res) => {
        UpdateUserController(req, res);
    })
    .delete(validate(DeleteUserSchema), (req, res) => {
        DeleteUserController(req, res);
    })
  
  module.exports = router