import express, { Request, Response } from 'express';
import { validate } from '../Middlewares/validationMiddleware';
import { GetJobListSchema, GetJobSchema, EditJobSchema, DeleteJobSchema, AddJobSchema } from '../Data/Schemas/jobSchema';
import { AddJobController, GetJobController, GetJobListController, UpdateJobController, DeleteJobController } from '../Controllers/jobController';
import { verifyJWT } from '../Middlewares/verifyJWT';

const router = express.Router()
router.use(verifyJWT)


  router.get("/", validate(GetJobListSchema),(req:Request , res:Response) => {
    GetJobListController(req, res);
  });

  router.post("/", validate(AddJobSchema),(req:Request , res:Response) => {
    AddJobController(req, res);
  });
  
  router
    .route("/:id")
    .get(validate(GetJobSchema), (req, res) => {
        GetJobController(req, res);
    })
    .patch(validate(EditJobSchema),(req, res) => {
        UpdateJobController(req, res);
    })
    .delete(validate(DeleteJobSchema), (req, res) => {
        DeleteJobController(req, res);
    })
  
  module.exports = router