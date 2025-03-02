import arcjet from "@arcjet/next";

// Create a base Arcjet instance for use by each handler
export default arcjet({
  key: process.env.ARCJET_KEY!,
  // We specify a custom fingerprint so we can dynamically build it within each
  // demo route.
  characteristics: ["fingerprint"],
  rules: [],
});
