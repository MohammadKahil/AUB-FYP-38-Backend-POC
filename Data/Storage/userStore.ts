import dotenv from 'dotenv';
import { UserNotFound } from '../../Errors/Errors/userError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
dotenv.config();

const mysql = require('mysql2/promise');



export async function AddUser(newUser:any){
    const newUserCreated = await prisma.user.create({data:newUser});
    return newUserCreated;
}

export async function GetUser(id:number) {
    const userRetrieved = await prisma.user.findMany({where:{id}});
    if(userRetrieved.length===0) throw new UserNotFound('User with target ID not found');
    return userRetrieved[0];
}


export async function EditUser(id:number, newUser:any){
    const updatedUser = await prisma.user.update({where:{id},data:newUser});
    return updatedUser;
}

export async function DeleteUser(id:number){
    const deletedUser = await prisma.user.delete({where:{id}});
    return deletedUser;

}

export async function GetAllUsers(params:any) {
    let paramS = params;
    if (paramS.id) {paramS = {...paramS, id:(parseInt(params.id))}}
    if (paramS.phoneNumber) {paramS = {...paramS, phoneNumber:(parseInt(params.phoneNumber))}}
    if (paramS.sSN) {paramS = {...paramS, sSN:(parseInt(params.sSN))}}

    const usersRetrieved = await prisma.user.findMany({where:{...paramS}});
    if(usersRetrieved.length===0) throw new UserNotFound('User with target ID not found');
    if (usersRetrieved.length!=0) {
        return usersRetrieved
    }else{
        throw new UserNotFound('No User matches the provided ID.');
    }
}