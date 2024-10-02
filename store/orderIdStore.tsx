import { create } from "zustand"
interface IOrderIdStore{
    orderId: string,
    setOrderId: (orderId:string) => void
    draftOrderId: string,
    setDraftOrderId: (draftOrderId:string) => void
    targetKey:string,
    setTargetKey: (targetKey:string) => void

}
export const useOrderIdStore = create<IOrderIdStore>((set,get)=>({
    orderId: "0",
    setOrderId: (orderId) => {
        set({orderId:orderId})
    },
    draftOrderId: "0",
    setDraftOrderId: (draftOrderId) => {
        set({draftOrderId:draftOrderId})
    },
    targetKey:"0",
    setTargetKey: (targetKey) =>{
        set({targetKey:targetKey})
    }
}))