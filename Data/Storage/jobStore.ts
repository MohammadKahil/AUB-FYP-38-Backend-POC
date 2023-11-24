import dotenv from 'dotenv';
import { JobNotFound } from '../../Errors/Errors/jobError';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();
dotenv.config();

export async function AddJob(newJob:any){
    const newJobCreated = await prisma.application.create({data:newJob});
    return newJobCreated;
}

export async function GetJob(id:string) {
    const JobRetrieved = await prisma.application.findMany({where:{id}});
    if(JobRetrieved.length===0) throw new JobNotFound('Job with target ID not found');
    return JobRetrieved[0];
}


export async function EditJob(id:string, newJob:any){
    const updatedJob = await prisma.application.update({where:{id},data:newJob});
    return updatedJob;
}

export async function DeleteJob(id:string){
    const deletedJob = await prisma.application.delete({where:{id}});
    return deletedJob;

}

export async function GetAllJobs(params:any) {
    let paramS = params;
    if (paramS.owner) {paramS = {...paramS, owner:(parseInt(params.owner))}}

    const JobsRetrieved = await prisma.application.findMany({where:{...paramS}});
    if(JobsRetrieved.length===0) throw new JobNotFound('Job with target ID not found');
    if (JobsRetrieved.length!=0) {
        return JobsRetrieved
    }else{
        throw new JobNotFound('No User matches the provided ID.');
    }
}