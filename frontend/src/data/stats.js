import { Code2, Trophy, Flame, Target } from "lucide-react";

export const stats = [
  {
    id: 1,
    title: "Problems Solved",
    value: 0,
    subtitle: "Total problems completed",
    icon: Code2,
    color: "#7C5CFC",
  },
  {
    id: 2,
    title: "Contest Rating",
    value: "—",
    subtitle: "Peak contest rating",
    icon: Trophy,
    color: "#F59E0B",
  },
  {
    id: 3,
    title: "Longest Streak",
    value: "0 Days",
    subtitle: "Days of coding",
    icon: Flame,
    color: "#EF4444",
  },
  {
    id: 4,
    title: "Daily Goal",
    value: "0/5",
    subtitle: "Problems completed today",
    icon: Target,
    color: "#22C55E",
  },
];
