import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const randomFacts = [
    "The Eiffel Tower can be 15 cm taller during the summer.",
    "Bananas are berries, but strawberries are not.",
    "Octopuses have three hearts.",
    "Honey never spoils.",
    "A bolt of lightning is five times hotter than the surface of the sun.",
    "Sharks existed before trees.",
    "Water can boil and freeze at the same time.",
    "A group of flamingos is called a 'flamboyance'.",
    "Humans share about 60% of their DNA with bananas.",
    "The shortest war in history lasted only 38 to 45 minutes.",
    "An ant can lift 50 times its own body weight.",
    "Your heart beats around 100,000 times a day.",
    "The inventor of the frisbee was turned into a frisbee after he died.",
    "A day on Venus is longer than a year on Venus.",
    "The human brain generates enough electricity to power a small light bulb.",
    "There’s a planet made of diamonds.",
    "Wombat poop is cube-shaped.",
    "The world's largest desert is Antarctica.",
    "A single strand of spaghetti is called a 'spaghetto'.",
    "The inventor of the light bulb, Thomas Edison, was afraid of the dark.",
    "Hot water freezes faster than cold water.",
    "There’s a species of jellyfish that is biologically immortal.",
    "A crocodile can't stick its tongue out.",
    "Sloths can hold their breath longer than dolphins can.",
    "Butterflies taste with their feet.",
    "The heart of a blue whale is the size of a small car.",
    "There are more stars in the universe than grains of sand on Earth.",
    "You can't hum while holding your nose.",
    "Banging your head against a wall burns 150 calories an hour.",
    "A group of crows is called a murder.",
    "The inventor of the Pringles can is buried in one.",
    "The unicorn is Scotland's national animal.",
    "Sea otters hold hands while sleeping to avoid drifting apart.",
    "The dot over the letter 'i' is called a tittle.",
    "The longest hiccuping spree lasted 68 years.",
    "Pineapples take about two years to grow.",
    "Cats can't taste sweetness.",
    "The average cloud weighs about a million pounds.",
    "A shrimp's heart is in its head.",
    "The human nose can detect over 1 trillion scents.",
    "There are more fake flamingos in the world than real ones.",
    "An octopus has nine brains.",
    "The inventor of the telephone, Alexander Graham Bell, never called his wife or mother because they were both deaf.",
    "The first oranges weren’t orange.",
    "Mosquitoes are attracted to people who just ate bananas.",
    "Elephants are the only animals that can't jump.",
    "The inventor of the Rubik's Cube took a month to solve his own puzzle.",
    "Cows have best friends and get stressed when they are separated.",
    "The average person will spend six months of their life waiting for red lights to turn green.",
    "A day on Mercury is longer than a year on Mercury.",
    "The Great Wall of China is not visible from space.",
    "The human body contains enough carbon to make 900 pencils.",
    "The first computer virus was created in 1986.",
    "There are more than 24 time zones in the world.",
    "A bolt of lightning contains enough energy to toast 100,000 slices of bread."
  ];

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * randomFacts.length);
    return randomFacts[randomIndex];
  };

  const correctSpelling = async (text) => {
    try {
      const response = await axios.post("https://api.textgears.com/spelling", {
        text,
        language: "en-US",
        key: "YOUR_TEXTGEARS_API_KEY",
      });
      return response.data.response.corrected || text;
    } catch (error) {
      console.error("Error correcting spelling:", error);
      return text;
    }
  };

  const fetchWikipediaInfo = async (query) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      return response.data.extract || "I couldn't find relevant information.";
    } catch (error) {
      console.error("Error fetching Wikipedia info:", error);
      return "⚠️ Couldn't retrieve data. Please try another question.";
    }
  };

  const fetchMathSolution = async (expression) => {
    try {
      const response = await axios.get(
        `https://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error solving math expression:", error);
      return "⚠️ Couldn't process the calculation.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let correctedInput = await correctSpelling(input);
    let botReply = await fetchWikipediaInfo(correctedInput);

    if (/\b(integrate|differentiate|derivative|antiderivative)\b/.test(correctedInput)) {
      const mathExpression = correctedInput.replace("integrate", "integrate(").replace("differentiate", "derivative(") + ")";
      botReply = await fetchMathSolution(mathExpression);
    }

    setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <h1>EDU-Bot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </p>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
        <button onClick={() => setMessages((prev) => [...prev, { text: getRandomFact(), sender: "bot" }])}>🎲 Random Fact</button>
        <button onClick={clearChat}>🗑 Clear</button>
      </div>
    </div>
  );
};

export default App;
