import { User } from '@prisma/client';
import { AddUser, GetUser, EditUser, DeleteUser, GetAllUsers } from '../Data/Storage/userStore';

export async function CreateNewUser(newUser:any):Promise<User> {
    const createdId = await AddUser(newUser);
    return createdId;
}

export async function EditUserService(id:number, newUser:any){
    const UserUpdated = await EditUser(id,newUser);
    return UserUpdated;
}

export async function GetUserService(id:number){
    const retrievedUser = await GetUser(id);
    return retrievedUser;
}

export async function DeleteUserService(id:number){
    const checkIfUserExists = await GetUserService(id);
    await DeleteUser(id);
}
export async function GetAllUsersService(params:any){
    const retrievedUsers = await GetAllUsers(params); 
    return retrievedUsers;
}