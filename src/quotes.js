const QUOTES = [
  'Well begun is half done.',
  'Small steps, every day.',
  'Simplicity is the ultimate sophistication.',
  'Done is better than perfect.',
  'The best time to start was yesterday. The next best time is now.',
  'Focus on progress, not perfection.',
  'What you do today can improve all your tomorrows.',
  'Rest is part of the work.',
  'Begin anywhere.',
  'Curiosity keeps the mind young.',
  'One task at a time.',
  'Little by little, one travels far.',
];

// Same quote all day, a different one each day.
export function quoteForDay(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.round((date - startOfYear) / 86_400_000);
  return QUOTES[dayOfYear % QUOTES.length];
}
