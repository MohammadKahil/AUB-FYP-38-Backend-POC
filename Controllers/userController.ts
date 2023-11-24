import { Request, Response } from "express";
import { CreateNewUser, GetUserService, EditUserService, DeleteUserService, GetAllUsersService } from "../Services/userService";
import { UserNotFound } from "../Errors/Errors/userError";
export async function AddUserController(req:any, res:Response){
    if (req.roles!=="admin") res.status(401).json({message:"Forbidden"});

    try{
        const createdUser = await CreateNewUser(req.body);
        res.status(201).json(createdUser);
    }
    catch (error:any){
        //bad stuffs
        res.status(500).json({type:"InternalServerError", message:error.message})
    }
}

export async function GetUserListController(req:any , res: Response){
    if (req.roles!=="admin") res.status(401).json({message:"Forbidden"});
    try{
        const retrievedUser = await GetAllUsersService(req.query)
        res.status(200).json(retrievedUser)
        //stuffs
    } catch (error:any) {
        if(error instanceof UserNotFound){
            res.status(404).json({type:"NotFoundError",message:error.message})
        }
        else{
            res.status(500).json({type:"InternalServerError", message:error.message})
        }
    }
}

export async function GetUserController(req: any, res: Response){
    if (req.roles!=="admin") res.status(401).json({message:"Forbidden"});
    try{
        const retrievedUser = await GetUserService(parseInt(req.params.id))
        res.status(200).json(retrievedUser)
        //stuffs
    } catch (error:any) {
        //bad stuffs
       if (error instanceof UserNotFound){
        res.status(404).json({type:"NotFoundError",message:error.message})
       }
       else{
        res.status(500).json({type:"InternalServerError", message:error.message})
       }
    }
}

export async function UpdateUserController(req: any, res: Response){
    if (req.roles!=="admin") res.status(401).json({message:"Forbidden"});
    try{
        await EditUserService(parseInt(req.params.id),req.body);
        const createdJob = await GetUserService(parseInt(req.params.id))
        res.status(200).json(createdJob);
    } catch (error:any) {
       if (error instanceof UserNotFound){
        res.status(404).json({type:"Not Found Error",message:error.message})
       }
       else if (error.code==="P2025"){
        res.status(404).json({type:"Not Found Error",message: "User to update not found"})
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
       else{
        res.status(500).json({type:"Internal Server Error", message:error})
       }
    }
}

export async function DeleteUserController(req: any, res: Response){
    if (req.roles!=="admin") res.status(401).json({message:"Forbidden"});
    try{
        await DeleteUserService(parseInt(req.params.id))
        res.sendStatus(204)
    }
    catch(error:any){
       if(error instanceof UserNotFound){
        res.status(404).json({type:"NotFoundError",message:error.message})
       }
       else{
        res.status(500).json({type:"InternalServerError", message:error.message})
       }
    }
}