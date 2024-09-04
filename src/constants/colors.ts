const COLORS = [
  // 20 colors random tailwindcss
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-600",
  "bg-yellow-600",
  "bg-green-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-red-700",
  "bg-yellow-700",
  "bg-green-700",
  "bg-blue-700",
  "bg-indigo-700",
  "bg-purple-700",
];

export function generateRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
