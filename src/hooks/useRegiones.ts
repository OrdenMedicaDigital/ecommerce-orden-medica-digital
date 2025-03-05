import { useEffect, useState } from "react"

interface Region{
    idRegion: number;
    name: string
}

export default function useRegiones(){
    const [regiones,setRegiones] = useState<Region[]>([])

    useEffect(()=>{
        fetch("/api/regiones")
        .then((data) => data.json())
        .then((data) => {
            setRegiones(data)
        })
    },[])

    return regiones
}