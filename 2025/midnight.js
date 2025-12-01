function waitUntilMidnight() {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // next day
    0, 0, 0, 0
  );

  const ms = midnight - now;
  return new Promise(resolve => setTimeout(resolve, ms));
}
await waitUntilMidnight()