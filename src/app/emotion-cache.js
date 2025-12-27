"use client";

import createCache from "@emotion/cache";

// ensures styles are injected in the same place every time
export default function createEmotionCache() {
  return createCache({ key: "mui", prepend: true });
}
