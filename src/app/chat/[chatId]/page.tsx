import { db } from "@/lib/db";
import { chats as chat_schema } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const chats = await db
    .select()
    .from(chat_schema)
    .where(eq(chat_schema.userId, userId));

  if (!chats) {
    return redirect("/");
  }

  if (!chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }
  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">{/* <ChatSideBar/> */}</div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          {/* <PDFViewer/> */}
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          {/* ChatComponent */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
