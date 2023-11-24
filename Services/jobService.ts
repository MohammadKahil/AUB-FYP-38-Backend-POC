import { Application } from '@prisma/client';
import { AddJob, GetJob, EditJob, DeleteJob, GetAllJobs } from '../Data/Storage/jobStore';

export async function CreateNewJob(newJob:any):Promise<Application> {
    const createdId = await AddJob(newJob);
    return createdId;
}

export async function EditJobService(id:string, newJob:any){
    const JobUpdated = await EditJob(id,newJob);
    return JobUpdated;
}

export async function GetJobService(id:string){
    const retrievedJob = await GetJob(id);
    return retrievedJob;
}

export async function DeleteJobService(id:string){
    const checkIfJobExists = await GetJobService(id);
    await DeleteJob(id);
}
export async function GetAllJobsService(params:any){
    const retrievedJobs = await GetAllJobs(params); 
    return retrievedJobs;
}