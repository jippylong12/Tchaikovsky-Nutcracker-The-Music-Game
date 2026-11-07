// happy-dom cannot run the Ruffle wasm runtime. Pre-install an inert RufflePlayer global so the shell's
// default loader resolves without trying to fetch /ruffle/ruffle.js. Tests that exercise Ruffle
// behaviour pass their own loader to createSourceSwfLayer.
type InertPlayer = HTMLElement & { ruffle(): { load(): Promise<void> } };

(window as unknown as { RufflePlayer: unknown }).RufflePlayer = {
  newest: () => ({
    createPlayer: () => {
      const element = document.createElement("div") as unknown as InertPlayer;
      element.ruffle = () => ({ load: () => Promise.resolve() });
      return element;
    },
  }),
};
