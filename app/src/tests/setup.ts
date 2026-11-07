// happy-dom cannot run the Ruffle wasm runtime. Pre-install an inert RufflePlayer global so the shell's
// default loader resolves without trying to fetch /ruffle/ruffle.js. Tests that exercise Ruffle
// behaviour pass their own loader to createSourceSwfLayer.
type InertPlayer = HTMLElement & { ruffle(): { load(): Promise<void> } };

// The live projector fetches its 6 MB movie before handing it to Ruffle. There is no asset server under
// happy-dom, so SWF fetches stay pending, as inert as the player. Tests that exercise the projector pass
// their own layer or loader.
const originalFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (/\.swf(?:[?#]|$)/i.test(url) && !url.includes("/__projector/")) return new Promise<Response>(() => {});
  // No recovered install is mirrored under test, so the room falls back to the hand-made routes. Tests that
  // exercise the original games stub these fetches themselves.
  if (url.includes("/projector-install/")) return Promise.resolve(new Response(null, { status: 404 }));
  return originalFetch(input, init);
};

(window as unknown as { RufflePlayer: unknown }).RufflePlayer = {
  newest: () => ({
    createPlayer: () => {
      const element = document.createElement("div") as unknown as InertPlayer;
      element.ruffle = () => ({ load: () => Promise.resolve() });
      return element;
    },
  }),
};
