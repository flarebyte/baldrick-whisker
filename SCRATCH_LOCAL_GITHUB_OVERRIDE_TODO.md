# Support local overrides for `github:` URIs

This scratch doc proposes how `github:` file references (e.g., `github:owner:repo:path/to/file`) can resolve to local filesystem paths when a mapping exists, otherwise they are fetched from GitHub as today.

## Understanding
- Use a single user config at `~/.baldrick-whisker/config.yaml` that maps `owner:repo` to a local root directory.
- When a mapping exists, resolve `github:owner:repo:path` to `path.join(root, path)` and read from the local filesystem instead of using Octokit.
- If no mapping exists, fetch the file from GitHub as today.
- If a mapping exists but the local file is missing, fail with a clear error (no fallback for now).

## Example config.yaml
```yaml
github:
  mappings:
    - repo: flarebyte:baldrick-reserve
      root: /Users/you/src/flarebyte/baldrick-reserve
```

## Resolution behavior
- Input: `github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml`
  - If mapped: use `/Users/you/src/flarebyte/baldrick-reserve/data/ts/baldrick-broth.yaml`.
  - If unmapped: fetch via Octokit (current behavior).
  - If mapped but local file missing: error with actionable message.
- Security: normalize and ensure final path remains within the mapped root.

## TODO

### Design
- [ ] Config location: only `~/.baldrick-whisker/config.yaml` (no env/project overrides initially).
- [ ] Schema: `github.mappings[].repo` (format `owner:repo`) and `root` (absolute path).
- [ ] Default behavior: unmapped repos fetch remotely; mapped repos must exist locally.
- [ ] Enforce strict path safety (reject traversal outside `root`).

### Implementation
- [ ] Config loader
  - [ ] Load `~/.baldrick-whisker/config.yaml` if it exists; parse YAML.
  - [ ] Validate minimal schema; provide clear error messages.
  - [ ] Optionally cache in-memory; provide a reload for tests.
- [ ] URI resolver
  - [ ] Implement `resolveGithubUri(uri, config)` returning `{ type: 'local'|'remote', path | owner/repo/path }`.
  - [ ] Normalize paths and guard against `..` traversal/escaping root.
- [ ] File IO wiring
  - [ ] Before Octokit fetch, call resolver.
  - [ ] If `local`: read file from FS; if `remote`: use existing fetch logic.
- [ ] Error handling
  - [ ] Mapped repo but local file missing: throw with message suggesting fixing mapping or file path.
  - [ ] Unmapped repo: proceed with remote fetch.

### Testing
- [ ] Unit tests
  - [ ] Config loader: present/absent file, minimal schema validation.
  - [ ] Resolver: mapped/unmapped, path normalization, traversal protection.
- [ ] Pest acceptance tests
  - [ ] In test setup, create `~/.baldrick-whisker/config.yaml` pointing to a local fixture root (within the repo workspace).
  - [ ] Use `github:` URIs that resolve into existing fixture files and assert local reads are used.
- [ ] Cross-platform
  - [ ] Normalize path handling for macOS/Linux/Windows.

### Docs
- [ ] README/USAGE: document local overrides for `github:` and the single config location.
- [ ] Provide config example and troubleshooting for missing file/wrong mapping.

### CI
- [ ] Add CI step that writes `~/.baldrick-whisker/config.yaml` for the job user before running acceptance tests that rely on local mapping.
- [ ] Keep existing remote-path tests intact (no changes needed).

### Rollout
- [ ] Implement behind a minor version bump; update changelog.
- [ ] Update README and release notes.
- [ ] Validate via `npx baldrick-dev-ts@latest release check` and CI.
