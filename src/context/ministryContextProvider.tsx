"use client"
import { getMinistries } from "@/lib/action";
import { MinistryType } from "@/lib/types/index_type";
import { createContext, useContext, useEffect, useState } from "react";


const contextType = {
    ministries: [] as MinistryType[],
    setMinistries: (ministries: MinistryType[]) => { }
}

const ministryContext = createContext<typeof contextType>(contextType)

export const useMinistryContext = () => useContext<typeof contextType>(ministryContext)

export default function MinistryContextProvider({ children }: { children: React.ReactNode }) {

    const [ministries, setMinistries] = useState<MinistryType[]>([])

    const fetchMinistries = async () => {
        const res = await getMinistries()
        setMinistries(res)
    }

    useEffect(() => {
        fetchMinistries()
    }, [ministries])

    return (
        <ministryContext.Provider value={{ ministries, setMinistries }}>
            {children}
        </ministryContext.Provider>
    );
}