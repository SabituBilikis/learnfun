/** Returns a time-of-day greeting with emoji. */
export function useGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return { text: "Good Morning",   emoji: "🌅" };
  if (h >= 12 && h < 18) return { text: "Good Afternoon", emoji: "☀️" };
  if (h >= 18 && h < 21) return { text: "Good Evening",   emoji: "🌇" };
  return { text: "Hello", emoji: "🌙" };
}
