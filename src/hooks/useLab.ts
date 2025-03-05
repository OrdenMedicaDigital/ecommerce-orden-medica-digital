import { useEffect, useState } from "react";

export default function useLab(){
    const [lab,setLab] = useState<{
            name:"",
            address:"",
            type:string,
            phone:"",
            email:"",
            id:0,
            encargado:"",
            planId:0,
            rut:"",
            orders: 0
    }>()

    useEffect(()=>{
        fetch("/api/labs").then(res=>res.json()).then((data)=>{
            setLab(data)
        })
    },[])

    return lab;
}