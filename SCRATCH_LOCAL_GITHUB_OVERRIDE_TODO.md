# Support local overrides for `github:` URIs

This scratch doc proposes how `github:` file references (e.g., `github:owner:repo:path/to/file`) can resolve to local filesystem paths when a mapping exists, otherwise they are fetched from GitHub as today.

## Understanding
- Default config lives at `~/.baldrick-whisker/config.yaml` and maps `owner:repo` to a local root directory.
- Also supports `BALDRICK_WHISKER_CONFIG` env var to point to an alternate config file (used by tests/CI). Precedence: env var > home.
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
- [ ] Config discovery: `BALDRICK_WHISKER_CONFIG` env var (if set) else `~/.baldrick-whisker/config.yaml`.
- [ ] Schema: `github.mappings[].repo` (format `owner:repo`) and `root` (absolute path).
- [ ] Default behavior: unmapped repos fetch remotely; mapped repos must exist locally.
- [ ] Enforce strict path safety (reject traversal outside `root`).

### Implementation
- [ ] Config loader
  - [ ] Load from `BALDRICK_WHISKER_CONFIG` if set; otherwise load `~/.baldrick-whisker/config.yaml` if it exists; parse YAML.
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
  - [ ] Config loader: env override path vs absent; minimal schema validation.
  - [ ] Resolver: mapped/unmapped, path normalization, traversal protection.
- [ ] Pest acceptance tests (self-contained)
  - [ ] In the spec, create a temporary config file inside the workspace (e.g., `temp/config.yaml`).
  - [ ] In the spec, set `BALDRICK_WHISKER_CONFIG=$PWD/temp/config.yaml` for steps that run the CLI.
  - [ ] Use `github:` URIs that resolve into local fixtures and assert local reads.
  - [ ] Example snippet:
    - Create config file
      - run: |
          mkdir -p temp
          cat > temp/whisker-config.yaml <<'YAML'
          github:
            mappings:
              - repo: flarebyte:baldrick-reserve
                root: $PWD/pest-spec/fixtures/local-reserve
          YAML
    - Use env override
      - env:
          BALDRICK_WHISKER_CONFIG: $PWD/temp/whisker-config.yaml
        run: |
          yarn cli object out.yaml github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml
- [ ] Cross-platform
  - [ ] Normalize path handling for macOS/Linux/Windows.

### Docs
- [ ] README/USAGE: document local overrides for `github:` and config discovery (env var + home). README is updated via baldrick-broth-model.yaml.
- [ ] Provide config example and troubleshooting for missing file/wrong mapping.

### CI
- [ ] No CI changes required. CI runs pest specs which create and use their own temp config via `BALDRICK_WHISKER_CONFIG`.
- [ ] Keep existing remote-path tests intact (no changes needed).

### Rollout
- [ ] Implement behind a minor version bump; update changelog.
- [ ] Update README and release notes.
- [ ] Validate via `npx baldrick-broth@latest test all`. Note: `baldrick-dev-ts release check` only validates version; no need to add it here.
