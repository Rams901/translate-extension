import {
  STORAGE_FIELD_AI_MODEL_CONFIG,
  STORAGE_FIELD_MODEL_PROVIDER,
} from "./constants";
import { AIModelConfig, ModelProvider, OpenAIConfig } from "./types";

export async function getAIModelConfig(): Promise<AIModelConfig | null> {
  const result = await chrome.storage.local.get(STORAGE_FIELD_AI_MODEL_CONFIG);
  return result[STORAGE_FIELD_AI_MODEL_CONFIG] || null;
}

export async function getModelProvider(): Promise<ModelProvider | null> {
  const aiModelConfig = await getAIModelConfig();
  if (!aiModelConfig) {
    return null;
  }

  return aiModelConfig.modelProvider;
}

export async function getModelProviderConfig(
  modelProvider: ModelProvider
): Promise<OpenAIConfig | null> {
  const aiModelConfig = await getAIModelConfig();
  if (!aiModelConfig) {
    return null;
  }

  return aiModelConfig[modelProvider];
}

export async function saveModelProviderConfig(
  modelProvider: ModelProvider,
  config: OpenAIConfig
): Promise<void> {
  const aiModelConfig = await getAIModelConfig();

  if (!aiModelConfig) {
    await chrome.storage.local.set({
      [STORAGE_FIELD_AI_MODEL_CONFIG]: {
        [STORAGE_FIELD_MODEL_PROVIDER]: modelProvider,
        [modelProvider]: {
          ...config,
        },
      },
    });
  } else {
    await chrome.storage.local.set({
      [STORAGE_FIELD_AI_MODEL_CONFIG]: {
        ...aiModelConfig,
        [STORAGE_FIELD_MODEL_PROVIDER]: modelProvider,
        [modelProvider]: {
          ...config,
        },
      },
    });
  }
}