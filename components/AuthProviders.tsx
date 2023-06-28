"use client"


import React , {useEffect , useState} from 'react'

import {getProviders , signIn} from "next-auth/react"



type Provider = {
  id : string,
  name:string,
  type : string,
  signinUrl : string,
  callbackUrl : string,
  signinUrlParams : Record<string,string> | null
}

type Providers = Record<string , Provider>


interface Props {}

const AuthProviders = () => {

  const [providers , setProviders] = useState<Providers | null>(null)
 
  useEffect(()=>{
        const fetchProviders = async () => {
            const res = await getProviders();
            //console.log(res)
        
            setProviders(res)
          }
          fetchProviders()
  },[])


  if(providers){
    return (
      <div>
        {Object.values(providers).map((provider : Provider , i : number)=>(
              <button key={i} onClick={()=>signIn(provider?.id)}>{provider.id}</button>
        ))}
      </div>
    )
  }
  return <div>AuthProviders</div>
}

export default AuthProviders