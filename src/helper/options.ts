import { EnumOrderTypes } from "@/interface/orderItem";
import { IStorage } from "@/interface/storage"

export const optionsStorage = (storages:IStorage[]) => {
    return storages.map((storage) => ({
        value: storage.storage_id,
        label: storage.storage_name,
    }))
}

export const optionsOrderTypes: { value: string; label: string }[] = [
    { value: EnumOrderTypes.WAREHOUSE, label: "Заявка на склад" },
    { value: EnumOrderTypes.PURCHASE, label: "Заявка на закуп" },
  ];