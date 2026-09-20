import { precacheAndRoute } from "@serwist/precaching";

// @ts-expect-error __SW_MANIFEST is injected by serwist webpack plugin at build time
precacheAndRoute(self.__SW_MANIFEST || []);
