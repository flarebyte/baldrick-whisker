import os from 'node:os';
import path from 'node:path';
import jetpack from 'fs-jetpack';
import YAML from 'yaml';
import type { LocalGithubConfig } from './model.js';

let cachedConfig: LocalGithubConfig | undefined;
let cachedPath: string | undefined;

const defaultConfig: LocalGithubConfig = {};

const discoverConfigPath = (): string => {
  const envPath = process.env['BALDRICK_WHISKER_CONFIG'];
  if (envPath && envPath.trim() !== '') {
    return path.resolve(envPath);
  }
  const home = os.homedir();
  return path.join(home, '.baldrick-whisker', 'config.yaml');
};

export const loadLocalGithubConfig = async (): Promise<LocalGithubConfig> => {
  const cfgPath = discoverConfigPath();
  if (cachedConfig && cachedPath === cfgPath) {
    return cachedConfig;
  }
  const exists = await jetpack.existsAsync(cfgPath);
  if (!exists) {
    cachedPath = cfgPath;
    cachedConfig = defaultConfig;
    return cachedConfig;
  }
  const content = await jetpack.readAsync(cfgPath, 'utf8');
  if (!content) {
    cachedPath = cfgPath;
    cachedConfig = defaultConfig;
    return cachedConfig;
  }
  try {
    const parsed = YAML.parse(content) as unknown;
    const cfg = validateConfig(parsed);
    cachedPath = cfgPath;
    cachedConfig = cfg;
    return cfg;
  } catch (error) {
    throw new Error(
      `Invalid config at ${cfgPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const reloadLocalGithubConfig = async (): Promise<LocalGithubConfig> => {
  cachedConfig = undefined;
  cachedPath = undefined;
  return loadLocalGithubConfig();
};

const validateConfig = (input: unknown): LocalGithubConfig => {
  const cfg = (input ?? {}) as Record<string, unknown>;
  const github = (cfg['github'] ?? {}) as Record<string, unknown>;
  const mappings = (github['mappings'] ?? []) as Array<Record<string, unknown>>;
  const validMappings = mappings
    .map((m) => ({ repo: m['repo'], root: m['root'] }))
    .filter((m) => typeof m.repo === 'string' && typeof m.root === 'string')
    .map((m) => ({ repo: String(m.repo), root: String(m.root) }));
  if (validMappings.length === 0) {
    return {};
  }
  return { github: { mappings: validMappings } };
};
