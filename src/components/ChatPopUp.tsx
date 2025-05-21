// src/ChatPopup.tsx
import React, { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

const socket: Socket = io("http://localhost:3000") // Zorg dat dit je backend-poort is

export const ChatPopup: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [myName, setMyName] = useState("")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [typing, setTyping] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let name = prompt("Voer je naam in:") || "Anonymous"
    setMyName(name)
    socket.emit("set username", name)

    socket.on("chat message", msg => {
      setMessages(prev => [...prev, msg])
    })
    socket.on("typing", user => setTyping(`${user} is aan het typen…`))
    socket.on("stop typing", () => setTyping(""))

    return () => {
      socket.off("chat message")
      socket.off("typing")
      socket.off("stop typing")
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    socket.emit("typing")
    setTimeout(() => socket.emit("stop typing"), 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    socket.emit("chat message", input)
    setInput("")
    socket.emit("stop typing")
  }

  return (
    <>
      <button
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        💬
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: 360,
              height: 600,
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                background: "#000",
                color: "#fff",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Chat</h2>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                }}
                onClick={() => setOpen(false)}
              >
                ✖
              </button>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "#f0f2f5",
                overflowY: "auto",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    maxWidth: "80%",
                    marginBottom: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: 12,
                    background: msg.user === myName ? "#000" : "#fff",
                    color: msg.user === myName ? "#fff" : "#333",
                    marginLeft: msg.user === myName ? "auto" : undefined,
                    borderBottomRightRadius: msg.user === myName ? 4 : 12,
                    borderBottomLeftRadius: msg.user !== myName ? 4 : 12,
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#bbacac", marginBottom: 4 }}>
                    <strong>{msg.user}</strong> · {msg.time}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ height: "1.5em", padding: "0 1rem", fontStyle: "italic", color: "#bbacac" }}>{typing}</div>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                padding: "0.5rem",
                borderTop: "1px solid #e0e0e0",
                background: "#fff",
              }}
            >
              <input
                value={input}
                onChange={handleInput}
                placeholder="Typ een bericht…"
                style={{
                  flex: 1,
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: 20,
                  outline: "none",
                  fontSize: "0.9rem",
                }}
              />
              <button
                type="submit"
                style={{
                  marginLeft: "0.5rem",
                  padding: "0 1rem",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
