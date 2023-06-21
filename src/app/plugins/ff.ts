import { OpenFeature } from '@openfeature/js-sdk';
import { InMemoryProvider } from '@openfeature/in-memory-provider';
import { env } from 'node:process';

const prefix = 'FEATURE_';
const bool = (v: string) => v?.toLowerCase?.() === 'true';
// @example .env FEATURE_XXXX="True"
const envToFlagRecord = (env: unknown) =>
  Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith(prefix))
      .map(([k, v]) => [k.slice(prefix.length), bool(v)])
  );

OpenFeature.setProvider(new InMemoryProvider(envToFlagRecord(env)));
const client = OpenFeature.getClient();

client;

// const showWelcomeMessage = await client.getBooleanValue(
//   'welcome-message',
//   false
// );
