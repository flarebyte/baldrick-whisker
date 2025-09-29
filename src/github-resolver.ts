import path from 'node:path';
import jetpack from 'fs-jetpack';
import type { GithubFile, LocalGithubConfig } from './model.js';

export type ResolvedGithub =
  | { type: 'local'; path: string }
  | { type: 'remote'; owner: string; repo: string; path: string };

export const resolveGithubUri = async (
  gh: GithubFile,
  config: LocalGithubConfig,
): Promise<ResolvedGithub> => {
  const mappings = config.github?.mappings ?? [];
  const key = `${gh.owner}:${gh.repo}`;
  const found = mappings.find((m) => m.repo === key);
  if (!found) {
    return { type: 'remote', owner: gh.owner, repo: gh.repo, path: gh.path };
  }
  const root = path.resolve(found.root);
  const candidate = path.resolve(root, gh.path);
  const relative = path.relative(root, candidate);
  const escapesRoot = relative.startsWith('..') || path.isAbsolute(relative);
  if (escapesRoot) {
    throw new Error(
      `Resolved path escapes mapping root: ${candidate} is outside ${root}`,
    );
  }
  const exists = await jetpack.existsAsync(candidate);
  if (!exists) {
    throw new Error(
      `Mapped local file not found: ${candidate}. Check mapping for ${key} or the requested path ${gh.path}.`,
    );
  }
  return { type: 'local', path: candidate };
};

