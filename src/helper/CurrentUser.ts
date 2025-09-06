import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useIsCurrentUser = (sender_id: number): boolean => {
  const meData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  if (!meData) return false;

  return meData.employee.buyer_id === sender_id;
};