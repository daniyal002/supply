import { create } from "zustand"
interface IApprovalStore{
    approvalOrderId: string,
    setApprovalOrderId: (orderId:string) => void
    approvalTargetKey:string,
    setApprovalTargetKey: (targetKey:string) => void

}
export const useApprovalStore = create<IApprovalStore>((set,get)=>({
    approvalOrderId: "0",
    setApprovalOrderId: (approvalOrderId) => {
        set({approvalOrderId:approvalOrderId})
    },

    approvalTargetKey:"0",
    setApprovalTargetKey: (approvalTargetKey) =>{
        set({approvalTargetKey:approvalTargetKey})
    }
}))