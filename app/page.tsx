"use client";

import Header from "@/components/ui/header";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 2,
  });
  return (
    <>
      <div className="flex flex-col w-full max-w-md py-6 mx-auto stretch">
        <Header />
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">
                  {m.role === "user" ? "User" : "Obtineo Customer Support"}
                </div>
                <p>
                  {m.content.length > 0 ? (
                    m.content
                  ) : (
                    <span className="italic font-light">
                      {"calling tool: " + m?.toolInvocations?.[0].toolName}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-y-10">
          <form onSubmit={handleSubmit}>
            <input
              className="fixed bottom-10 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Say anything..."
              onChange={handleInputChange}
            />
          </form>
          <footer className="fixed bottom-0 w-full max-w-md pt-8 mb-4 rounded text-center items-center">
            <small>
              &copy; 2024{" "}
              <a href="https://sagbho.github.io/" className="font-bold">
                Obtineo.
              </a>{" "}
              All rights reserved.
            </small>
          </footer>
        </div>
      </div>
    </>
  );
}
