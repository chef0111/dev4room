import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  slidingWindow,
  shield,
} from "@arcjet/next";

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  slidingWindow,
  shield,
};

export default arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [],
});
