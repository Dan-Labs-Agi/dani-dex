import { Button, Dialog, IconButton, Input, X } from "@openbot/ui";
import { createMemo, createSignal, For, Show } from "solid-js";
import { useText } from "../../text";
import { CHARACTER_COUNT, characterIndexForSeed, characterSeed, characterUrlAt } from "./character-faces";
import {
  CHARACTER_COLOR_HUES,
  CHARACTER_COLORS,
  CHARACTER_SPECS,
  characterLabel,
} from "./character-meta";

export interface CharacterCatalogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Seed of the character the agent has now, so it can start selected. */
  currentSeed?: string | undefined;
  onChoose: (seed: string) => void;
}

const ALL_INDEXES = Array.from({ length: CHARACTER_COUNT }, (_, index) => index);

export function CharacterCatalogue(props: CharacterCatalogueProps) {
  const { t } = useText();
  const [query, setQuery] = createSignal("");
  const [color, setColor] = createSignal<number | null>(null);
  const [picked, setPicked] = createSignal<number | null>(null);

  const current = createMemo(() => picked() ?? characterIndexForSeed(props.currentSeed ?? ""));
  const visible = createMemo(() => {
    const words = query().trim().toLowerCase().split(/\s+/).filter(Boolean);
    return ALL_INDEXES.filter((index) => {
      const spec = CHARACTER_SPECS[index];
      if (!spec) return false;
      if (color() !== null && spec[0] !== color()) return false;
      const label = characterLabel(index).toLowerCase();
      return words.every((word) => label.includes(word));
    });
  });

  function confirm(): void {
    const index = current();
    if (index === null) return;
    props.onChoose(characterSeed(index));
    props.onOpenChange(false);
  }

  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="agent-template-backdrop">
          <Dialog.Content as="section" class="character-catalogue">
            <Dialog.Title class="character-catalogue-title">{t("agent.characters.title")}</Dialog.Title>
            <Dialog.Description class="sr-only">{t("agent.characters.description")}</Dialog.Description>
            <IconButton
              class="character-catalogue-close"
              variant="ghost"
              type="button"
              label={t("common.close")}
              onClick={() => props.onOpenChange(false)}
            >
              <X aria-hidden="true" />
            </IconButton>
            <div class="character-catalogue-filters">
              <Input
                value={query()}
                placeholder={t("agent.characters.search")}
                aria-label={t("agent.characters.search")}
                autocomplete="off"
                onValueChange={setQuery}
              />
            </div>
            <div class="character-catalogue-colors" role="group" aria-label={t("agent.characters.colorFilter")}>
              <Button
                variant="ghost"
                type="button"
                size="sm"
                class="character-catalogue-chip"
                aria-pressed={color() === null ? "true" : "false"}
                onClick={() => setColor(null)}
              >
                {t("agent.characters.allColors")}
              </Button>
              <For each={CHARACTER_COLORS}>
                {(name, index) => (
                  <Button
                    variant="ghost"
                    type="button"
                    size="sm"
                    class="character-catalogue-swatch"
                    aria-label={name}
                    aria-pressed={color() === index() ? "true" : "false"}
                    onClick={() => setColor(color() === index() ? null : index())}
                    style={{ "--swatch": `hsl(${CHARACTER_COLOR_HUES[index()]} 72% 58%)` }}
                  />
                )}
              </For>
            </div>
            <div class="character-catalogue-grid" aria-label={t("agent.characters.title")}>
              <For each={visible()}>
                {(index) => (
                  <Button
                    variant="ghost"
                    type="button"
                    class="character-catalogue-item"
                    aria-pressed={current() === index ? "true" : "false"}
                    aria-label={characterLabel(index)}
                    title={characterLabel(index)}
                    onClick={() => setPicked(index)}
                    onDblClick={() => {
                      setPicked(index);
                      confirm();
                    }}
                  >
                    <img src={characterUrlAt(index)} alt="" loading="lazy" draggable={false} />
                  </Button>
                )}
              </For>
              <Show when={visible().length === 0}>
                <p class="character-catalogue-empty">{t("agent.characters.none")}</p>
              </Show>
            </div>
            <div class="character-catalogue-footer">
              <Show
                when={current() !== null}
                fallback={<span class="character-catalogue-name">{t("agent.characters.count", { count: visible().length })}</span>}
              >
                <img class="character-catalogue-preview" src={characterUrlAt(current() ?? 0)} alt="" />
                <span class="character-catalogue-name">{characterLabel(current() ?? 0)}</span>
              </Show>
              <Button variant="primary" type="button" disabled={current() === null} onClick={confirm}>
                {t("agent.characters.use")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
