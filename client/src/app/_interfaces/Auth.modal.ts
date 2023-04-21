export interface User{
    firstname: string, 
    lastname: string, 
    username: string, 
    email: string, 
    token: string
}

export interface LoginDTO{
    username: string, 
    password: string
}

export interface RegisterDTO{
    firstname: string, 
    lastname: string, 
    username: string, 
    email: string, 
    password: string
}