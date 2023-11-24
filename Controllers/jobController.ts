import { Request, Response } from "express";
import {
  CreateNewJob,
  GetJobService,
  EditJobService,
  DeleteJobService,
  GetAllJobsService,
} from "../Services/jobService";
import { JobNotFound } from "../Errors/Errors/jobError";
import { GetAllUsers } from "../Data/Storage/userStore";
export async function AddJobController(req: any, res: Response) {
  try {
    if (req.roles === "user") {
      const foundUser = await GetAllUsers({ email: req.user });
      req.body.owner = foundUser[0].id;
    }
    const createdJob = await CreateNewJob(req.body);
    res.status(201).json(createdJob);
  } catch (error: any) {
    //bad stuffs
    if (error.code === "P2003") {
      res.status(400).json({
        type: "Bad Request",
        message: `Related attribute not found: ${error.meta.field_name}`,
      });
    } else {
      res.status(500).json({ type: "InternalServerError", message: error });
    }
  }
}

export async function GetJobListController(req: any, res: Response) {
  try {
    if (req.roles === "user") {
      const foundUser = await GetAllUsers({ email: req.user });
      req.query.owner = foundUser[0].id;
    }
    const retrievedJob = await GetAllJobsService(req.query);
    res.status(200).json(retrievedJob);
    //stuffs
  } catch (error: any) {
    if (error instanceof JobNotFound) {
      res.status(404).json({ type: "Not Found Error", message: error.message });
    } else {
      res
        .status(500)
        .json({ type: "Internal Server Error", message: error.message });
    }
  }
}

export async function GetJobController(req: any, res: Response) {
  try {
    if (req.roles === "user") {
      const foundUser = await GetAllUsers({ email: req.user });
      const retrievedJob = await GetJobService(req.params.id);
      if (foundUser[0].id == retrievedJob.owner) {
        res.status(200).json(retrievedJob);
      } else {
        res
          .status(404)
          .json({ type: "Not Found Error", message: "job not found" });
      }
    } else {
      const retrievedJob = await GetJobService(req.params.id);
      res.status(200).json(retrievedJob);
    }
    //stuffs
  } catch (error: any) {
    //bad stuffs
    if (error instanceof JobNotFound) {
      res.status(404).json({ type: "NotFoundError", message: error.message });
    } else {
      res
        .status(500)
        .json({ type: "InternalServerError", message: error.message });
    }
  }
}

export async function UpdateJobController(req: any, res: Response) {
  try {
    if (req.roles === "user") {
      const foundUser = await GetAllUsers({ email: req.user });
      const retrievedJob = await GetJobService(req.params.id);
      if (foundUser[0].id == retrievedJob.owner) {
        await EditJobService(req.params.id, req.body);
        const createdJob = await GetJobService(req.params.id);
        res.status(200).json(createdJob);
      } 
      else {
        res
          .status(404)
          .json({ type: "Not Found Error", message: "job not found" });
      }
    }
    else{
        await EditJobService(req.params.id, req.body);
        const createdJob = await GetJobService(req.params.id);
        res.status(200).json(createdJob);
    }
  } catch (error: any) {
    if (error instanceof JobNotFound) {
      res.status(404).json({ type: "Not Found Error", message: error.message });
    } else if (error.code === "P2025") {
      res
        .status(404)
        .json({ type: "Not Found Error", message: "Job to update not found" });
    }
    else  if (error.code === "P2002") {
        res.status(409).json({
          error: "Conflict",
          message: `The following attribute must be unique: ${error.meta.target}`,
        });
      }
      else if (error.name==="Prisma ClientValidation Error"){
        res.status(400).json({type:"Bad Request",message: "Cannot change requested parameters"})
       }
    else {
      res.status(500).json({ type: "Internal Server Error", message: error });
    }
  }
}

export async function DeleteJobController(req: any, res: Response) {
  try {
    if (req.roles === "user") {
      const foundUser = await GetAllUsers({ email: req.user });
      const retrievedJob = await GetJobService(req.params.id);
      if (foundUser[0].id == retrievedJob.owner) {
        await DeleteJobService(req.params.id);
        res.sendStatus(204);
      } else {
        res
          .status(404)
          .json({ type: "Not Found Error", message: "job not found" });
      }
    } else {
      await DeleteJobService(req.params.id);
      res.sendStatus(204);
    }
  } catch (error: any) {
    if (error instanceof JobNotFound) {
      res.status(404).json({ type: "NotFoundError", message: error.message });
    } else {
      res
        .status(500)
        .json({ type: "InternalServerError", message: error.message });
    }
  }
}
