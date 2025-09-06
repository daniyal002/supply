// "use client";

// import { useWebSocket } from "@/hook/useWebSocket";
// import { useCallback } from "react";
// import { useMessageStore } from "../../../store/chatStore";

// export default function MessagesHandler() {
//   const setMessages = useMessageStore(
//     (state) => state.setMessages
//   );

//   const handleHistory = useCallback((event: any) => {
//     setMessages(event.detail.data.reverse())
//   }, []);

//   useWebSocket({
//     history_chat_message:handleHistory,
//   });

//   return(<></>)
// }
