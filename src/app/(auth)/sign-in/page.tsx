"use client"
 import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from 'next/link'
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/Schemas/signupScehema'
import axios, {AxiosError} from 'axios';
import { ApiResponse } from '@/types/ApiRenponse'



const Page = () => {
  const [username,setUsername] = useState('');
  const [usernameMessage,setusernameMessage] = useState('');
  const [ischeckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
  
  const debounceUsername = useDebounceValue(username,300);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(debounceUsername) {
        setIsCheckingUsername(true);
        setusernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`);
          setusernameMessage(response.data.message)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setusernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique()
  },[debounceUsername])


  const onSubmit = async (data:z.infer<typeof signUpSchema>)=> {
    setIsSubmitting(true);
    try {
        const response = await axios.post<ApiResponse>('/api/sign-up',data);
        toast({
          title: 'Success',
          description: response.data.message
        })
        router.replace(`/verify/${username}`);
        setIsSubmitting(false);
    } catch (error) {
        console.error("Error in sign-up of user");
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message;
        toast({
          title: "sign-up failed",
          description: errorMessage,
          variant: "destructive"
        })
        setIsSubmitting(false);
    }
  }

  return (
    <div className=""></div>
  )
}

export default Page