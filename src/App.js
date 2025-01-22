import React, { useState } from "react";
import "../src/chatbot.css"; // Importing CSS file for styling

const handleResponse = async (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return {
      botMessage: "Hello! How can I assist you today? Please choose an option below:",
      options: [
        { id: "joke", label: "Tell me a joke" },
        { id: "motivation", label: "Motivate me" },
        { id: "time", label: "What's the time?" },
        { id: "bored", label: "I'm bored"},
      ],
    };
  } else if (lowerMessage === "joke") {
    try {
      const response = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await response.json();
      return { botMessage: `${data.setup} - ${data.punchline}` };
    } catch {
      return { botMessage: "Sorry, I couldn't fetch a joke at the moment. Please try again later." };
    }
  } else if (lowerMessage === "motivation") {
    try {
      const response = await fetch("https://ronreiter-meme-generator.p.rapidapi.com/meme");
      const data = await response.json();
      return { botMessage: `${data[0].q} - ${data[0].a}` };
    } catch {
      return { botMessage: "Sorry, I couldn't fetch a motivational quote at the moment. Please try again later." };
    }
  } else if (lowerMessage === "time") {
    const currentTime = new Date().toLocaleTimeString();
    return { botMessage: `The current time is ${currentTime}.` };
  } else if (lowerMessage.includes("bye")) {
    return { botMessage: "Goodbye! Have a great day!" };
  } 
  else if (lowerMessage === "bored") {
    try {
      const response = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await response.json();
      return { botMessage: `${data.setup} - ${data.punchline}` };
    } catch {
      return { botMessage: "Sorry, I couldn't fetch a joke at the moment. Please try again later." };
    }
  }else {
    return { botMessage: "I'm AIVOA chatbot. I'm currently in the implementation stage. Could you ask something else?" };
  }

};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async (message = userInput) => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);

    const response = await handleResponse(message);
    const botMessage = { sender: "bot", text: response.botMessage, options: response.options || [] };

    setMessages((prev) => [...prev, botMessage]);
    setUserInput("");
  };

  const handleOptionClick = (optionId) => {
    sendMessage(optionId);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">AIVOA Chatbot</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
            {msg.sender === "bot" && msg.options?.length > 0 && (
              <div className="bot-options">
                {msg.options.map((option) => (
                  <button
                    key={option.id}
                    className="option-button"
                    onClick={() => handleOptionClick(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message here..."
          className="input-field"
        />
        <button onClick={() => sendMessage()} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
