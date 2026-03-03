export const ICE_SERVERS = [
  { urls: "stun:stun.cloudflare.com:3478" },
  {
    urls: [
      "turn:turn.cloudflare.com:3478?transport=udp",
      "turn:turn.cloudflare.com:3478?transport=tcp",
      "turns:turn.cloudflare.com:5349?transport=tcp",
    ],
    username:
      "g0bb58cb25ecf569a219f2cb2bca0043815dbc0f79bb77ebf722de161d898568",
    credential:
      "f99d648bf2d8b651ab39ecfd6db8b393b0a19c3df668a8b1987358d16a62b6d5",
  },
];
