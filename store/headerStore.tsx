import { useGetMe } from "@/hook/userHook"
import { create } from "zustand"
interface IHeaderStore{
    login: string,
    setLogin: (login:string) => void
    collapsed:boolean,
    editCollapsed: (edit:boolean) => void
}
export const useHeaderStore = create<IHeaderStore>((set,get)=>({
    login:"Гость",
    setLogin: (login) => {
        set({login:login})
    },
    collapsed:true,
    editCollapsed: (edit) => {
        set({collapsed:edit})
    },
}))