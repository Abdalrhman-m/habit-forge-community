
import { useEffect, useState } from "react";

export default function WelcomeBanner() {
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);
  
  return (
    <div className="mb-8 animation-fade-in">
      <h1 className="text-3xl font-bold">{greeting}!</h1>
      <p className="text-muted-foreground">Track your habits and build consistency</p>
    </div>
  );
}
