import { LoginSchema } from "../schemas/login.schema"
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { useLoginMutation } from "../api/queryHooks"; // NOTE: This hook is obsolete, but updating the file anyway.
// import { redirect } from "@tanstack/react-router";
// import { ROUTES } from "@/constants/routes";
// import { showErrorToasts } from "@/utils/helpers";
// import { LoginResponse } from "../types/login";

export const useLogin = ()=>{

        type LoginFormFields = z.infer<typeof LoginSchema> // Now infers { phone: string }


         const {
            register,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = useForm<LoginFormFields>({
            resolver: zodResolver(LoginSchema),
        });


//    const mutation = useLoginMutation();




        const onSubmit = async(data:LoginFormFields)=>{
            console.log("Login data: ",data);
            // const res = mutation.mutate(data , {
            //     onSuccess:(data:LoginResponse)=>{
            //         redirect({
            //             to:ROUTES.DASHBOARD
            //         })
            //     },
            //     onError:(error)=>{
            //         showErrorToasts(error)
            //     }

            // } )
         

        }












         return {
            register ,
            handleSubmit ,
            errors ,
            isSubmitting ,
            // isPending:mutation.isPending ,
            onSubmit
            
         }

}