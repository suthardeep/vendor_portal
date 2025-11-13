import { LoginPayload } from '../types/login'
import { login } from './queryFunctions'
import { useMutation } from '@tanstack/react-query'



export const useLoginMutation = () =>{
    return useMutation({
        mutationFn:(data:LoginPayload)=>login(data)
    })

}







