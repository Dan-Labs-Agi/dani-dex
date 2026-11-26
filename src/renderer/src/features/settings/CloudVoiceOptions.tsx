import {
  CLOUD_VOICE_CATALOG,
  type CloudVoiceChoice,
  type CloudVoiceProvider,
} from "@openbot/contracts/voice-providers";
import {
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@openbot/ui";
import { useText } from "@openbot/ui/text";
import { createSignal, Show } from "solid-js";

interface CloudVoiceOptionsProps {
  provider: CloudVoiceProvider;
  choice: CloudVoiceChoice;
  disabled: boolean;
  mount?: HTMLElement | undefined;
  onChange: (patch: Partial<CloudVoiceChoice>) => void;
}

/** Model, voice, speed and custom voice id for a cloud speech provider. Models carry a Free or Paid tag. */
export function CloudVoiceOptions(props: CloudVoiceOptionsProps) {
  const { t, format } = useText();
  const catalog = () => CLOUD_VOICE_CATALOG[props.provider];
  const modelLabel = (id: string) => {
    const model = catalog().models.find((item) => item.id === id);
    if (!model) return id;
    return `${model.name} · ${model.free ? t("settings.voice.cloud.free") : t("settings.voice.cloud.paid")}`;
  };
  const voiceLabel = (id: string) => catalog().voices.find((item) => item.id === id)?.name ?? id;
  const [custom, setCustom] = createSignal("");
  const saveCustom = () => {
    const id = custom().trim();
    if (id && id !== props.choice.voice) props.onChange({ voice: id });
    setCustom("");
  };
  const voiceIds = () => {
    const ids = catalog().voices.map((voice) => voice.id);
    return ids.includes(props.choice.voice) ? ids : [props.choice.voice, ...ids];
  };
  return (
    <>
      <Item data-provider-option="model" class="settings-modal-row">
        <ItemContent>
          <ItemTitle>{t("settings.voice.cloud.model")}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Select<string>
            class="settings-modal-select"
            options={catalog().models.map((model) => model.id)}
            value={props.choice.model}
            onChange={(next) => next && props.onChange({ model: next })}
            disabled={props.disabled}
            placement="bottom-end"
            itemComponent={(selectProps) => (
              <SelectItem item={selectProps.item}>{modelLabel(selectProps.item.rawValue)}</SelectItem>
            )}
          >
            <SelectTrigger size="sm" aria-label={t("settings.voice.cloud.model")}>
              <SelectValue<string>>
                {(state) => {
                  const id = state.selectedOption();
                  return id && modelLabel(id);
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent mount={props.mount} />
          </Select>
        </ItemActions>
      </Item>
      <Item data-provider-option="voice" class="settings-modal-row">
        <ItemContent>
          <ItemTitle>{t("settings.voice.speech.voice.title")}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Select<string>
            class="settings-modal-select"
            options={voiceIds()}
            value={props.choice.voice}
            onChange={(next) => next !== null && props.onChange({ voice: next })}
            disabled={props.disabled}
            placement="bottom-end"
            itemComponent={(selectProps) => (
              <SelectItem item={selectProps.item}>{voiceLabel(selectProps.item.rawValue)}</SelectItem>
            )}
          >
            <SelectTrigger size="sm" aria-label={t("settings.voice.speech.voice.title")}>
              <SelectValue<string>>{(state) => voiceLabel(state.selectedOption() ?? "")}</SelectValue>
            </SelectTrigger>
            <SelectContent mount={props.mount} />
          </Select>
        </ItemActions>
      </Item>
      <Show when={catalog().customVoice}>
        <Item data-provider-option="voice-id" class="settings-modal-row">
          <ItemContent>
            <ItemTitle>{t("settings.voice.cloud.voiceId")}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <div class="settings-modal-link-select settings-voice-key-field">
              <Input
                size="sm"
                autocomplete="off"
                spellcheck={false}
                aria-label={t("settings.voice.cloud.voiceId")}
                placeholder={t("settings.voice.cloud.voiceIdPlaceholder")}
                value={custom()}
                disabled={props.disabled}
                onValueChange={setCustom}
                onBlur={saveCustom}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveCustom();
                }}
              />
            </div>
          </ItemActions>
        </Item>
      </Show>
      <Item data-provider-option="speed" class="settings-modal-row">
        <ItemContent>
          <ItemTitle>{t("settings.voice.speech.speed.title")}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Select<number>
            class="settings-modal-select"
            options={[...catalog().speeds]}
            value={props.choice.speed}
            onChange={(next) => next !== null && props.onChange({ speed: next })}
            disabled={props.disabled}
            placement="bottom-end"
            itemComponent={(selectProps) => (
              <SelectItem item={selectProps.item}>
                {t("chat.voice.speedValue", { speed: format.number(selectProps.item.rawValue) })}
              </SelectItem>
            )}
          >
            <SelectTrigger size="sm" aria-label={t("settings.voice.speech.speed.title")}>
              <SelectValue<number>>
                {(state) => {
                  const speed = state.selectedOption();
                  return speed && t("chat.voice.speedValue", { speed: format.number(speed) });
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent mount={props.mount} />
          </Select>
        </ItemActions>
      </Item>
    </>
  );
}
