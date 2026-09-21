import { precacheAndRoute } from "@serwist/precaching";

// @ts-expect-error __SW_MANIFEST is injected by serwist webpack plugin at build time
precacheAndRoute(self.__SW_MANIFEST || []);

const MODEL_CACHE = "ar-models-v1";

self.addEventListener("fetch", function(event) {
    // @ts-expect-error FetchEvent type not in lib dom
    var url = new URL(event.request.url);

    if (url.pathname.endsWith(".glb") || url.pathname.includes("/models/")) {
        // @ts-expect-error respondWith not in lib dom
        event.respondWith(
            caches.open(MODEL_CACHE).then(function(cache) {
                // @ts-expect-error event.request type
                return cache.match(event.request).then(function(cached) {
                    if (cached) return cached;
                    // @ts-expect-error event.request type
                    return fetch(event.request).then(function(response) {
                        if (response && (response.status === 200 || response.type === "opaque")) {
                            // @ts-expect-error event.request type
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    });
                });
            })
        );
    }
});
