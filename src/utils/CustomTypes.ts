
export interface IUser {
    name: string;
    id: string;
    connectionId:string;
    token:string;
}
  
export interface IState{
    user:IUser
}