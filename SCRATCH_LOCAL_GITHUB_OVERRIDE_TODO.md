# Support local overrides for `github:` URIs

This scratch doc proposes how `github:` file references (e.g.,
`github:owner:repo:path/to/file`) can resolve to local filesystem paths when
a mapping exists, otherwise they are fetched from GitHub as today.

## Understanding

-   Default config lives at `~/.baldrick-whisker/config.yaml` and maps
    `owner:repo` to a local root directory.
-   Also supports `BALDRICK_WHISKER_CONFIG` env var to point to an
    alternate config file (used by tests/CI). Precedence: env var > home.
-   When a mapping exists, resolve `github:owner:repo:path` to
    `path.join(root, path)` and read from the local filesystem instead of
    using Octokit.
-   If no mapping exists, fetch the file from GitHub as today.
-   If a mapping exists but the local file is missing, fail with a clear
    error (no fallback for now).

## Example config.yaml

```yaml
github:
  mappings:
    - repo: flarebyte:baldrick-reserve
      root: /Users/you/src/flarebyte/baldrick-reserve
```

## Resolution behavior

-   Input: `github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml`
    -   If mapped: use
        `/Users/you/src/flarebyte/baldrick-reserve/data/ts/baldrick-broth.yaml`.
    -   If unmapped: fetch via Octokit (current behavior).
    -   If mapped but local file missing: error with actionable message.
-   Security: normalize and ensure final path remains within the mapped
    root.

## TODO

### Design

-   [x] Config discovery: `BALDRICK_WHISKER_CONFIG` env var (if set) else
    `~/.baldrick-whisker/config.yaml`.
-   [x] Schema: `github.mappings[].repo` (format `owner:repo`) and `root`
    (absolute path).
-   [x] Default behavior: unmapped repos fetch remotely; mapped repos must
    exist locally.
-   [x] Enforce strict path safety (reject traversal outside `root`).

### Implementation

-   [x] Config loader
    -   [x] Load from `BALDRICK_WHISKER_CONFIG` if set; otherwise load
        `~/.baldrick-whisker/config.yaml` if it exists; parse YAML.
    -   [x] Validate minimal schema; provide clear error messages.
    -   [x] Optionally cache in-memory; provide a reload for tests.
-   [x] URI resolver
    -   [x] Implement `resolveGithubUri(uri, config)` returning `{ type:
        'local'|'remote', path | owner/repo/path }`.
    -   [x] Normalize paths and guard against `..` traversal/escaping root.
-   [x] File IO wiring
    -   [x] Before Octokit fetch, call resolver.
    -   [x] If `local`: read file from FS; if `remote`: use existing fetch
        logic.
-   [x] Error handling
    -   [x] Mapped repo but local file missing: throw with message suggesting
        fixing mapping or file path.
    -   [x] Unmapped repo: proceed with remote fetch.

### Testing

-   [x] Unit tests
    -   [x] Config loader: env override path vs absent; minimal schema
        validation.
    -   [x] Resolver: mapped/unmapped, path normalization, traversal
        protection.
-   [x] Pest acceptance tests (self-contained)
    -   [x] Use a fixture config inside the repo
        (`pest-spec/fixtures/local-config-here.yaml`) and set
        `BALDRICK_WHISKER_CONFIG` per step.
    -   [x] Use `github:` URIs that resolve into local fixtures and assert
        local reads.
    -   [ ] Example snippet:
        -   Create config file
            -   run: |
                mkdir -p temp
                cat > temp/whisker-config.yaml <<'YAML'
                github:
                mappings: - repo: flarebyte:baldrick-reserve
                root: $PWD/pest-spec/fixtures/local-reserve
                YAML
        -   Use env override
            -   env:
                BALDRICK\_WHISKER\_CONFIG: $PWD/temp/whisker-config.yaml
                run: |
                yarn cli object out.yaml github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml
-   [ ] Cross-platform
    -   [ ] Normalize path handling for macOS/Linux/Windows.

### Manual sanity (yarn cli)

-   [x] Mapped read succeeds
    -   Setup config: write `~/.baldrick-whisker/config.yaml` or a temp file
        and export `BALDRICK_WHISKER_CONFIG` to point to a local clone/fixture.
    -   Run: `yarn cli object report/out.yaml
        github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml`
    -   Expect: exit 0, `report/out.yaml` created and contains YAML from the
        local file.
-   [x] Mapped render succeeds
    -   Run: `yarn cli render report/out.yaml pest-spec/fixtures/example.hbs
        report/rendered.md`
    -   Expect: `report/rendered.md` created; uses data from mapped local YAML.
-   [x] Unmapped repo falls back to remote (network required)
    -   Unset mapping for `flarebyte:baldrick-reserve` (or comment it out) and
        unset `BALDRICK_WHISKER_CONFIG`.
    -   Run: `yarn cli object report/out.yaml
        github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml`
    -   Expect: exits 0 and fetches from GitHub.
-   [x] Mapped but file missing -> clear error
    -   Keep mapping but reference a non-existent path:
        `github:flarebyte:baldrick-reserve:does/not/exist.yaml`.
    -   Expect: non-zero exit, actionable error mentioning missing local path.
-   [ ] Env override precedence over home
    -   Create home config with mapping A and temp config with mapping B
        (different root).
    -   Export `BALDRICK_WHISKER_CONFIG` to temp config and run the object
        command.
    -   Expect: it uses mapping B.
-   [x] Path traversal blocked
    -   Run with `github:flarebyte:baldrick-reserve:../../etc/passwd`.
    -   Expect: non-zero exit, error explaining path escapes mapping root.

### Automated (pest) scenarios

-   [x] Mapped read (object)
    -   Spec creates temp config mapping `flarebyte:baldrick-reserve` to
        `pest-spec/fixtures/local-reserve`.
    -   Run: `yarn cli object report/out.yaml
        github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml` with env
        override.
    -   Assert snapshot of `report/out.yaml` matches fixture.
-   [x] Mapped read (render)
    -   Use same config; run render with the YAML as a source and a simple
        template.
    -   Assert snapshot of rendered output.
-   [x] Mapped but missing file -> error
    -   Reference a non-existent path under the mapped repo.
    -   Assert non-zero exit and error text contains “not found” and the
        resolved local path.
-   [x] Env override in spec
    -   Ensure the env var is set per-step so tests do not depend on user home.
-   [x] Traversal blocked
    -   Attempt `github:flarebyte:baldrick-reserve:../../hack.txt` and assert
        error about escaping root.
-   [x] Do not test remote fetch in pest
    -   Avoid network dependency; remote fetch behavior is covered by manual
        sanity if desired.

### Docs

-   [ ] README/USAGE: document local overrides for `github:` and config
    discovery (env var + home). README is updated via
    baldrick-broth-model.yaml.
-   [ ] Provide config example and troubleshooting for missing file/wrong
    mapping.

### CI

-   [x] No CI changes required. CI runs pest specs which create and use
    their own temp config via `BALDRICK_WHISKER_CONFIG`.
-   [x] Keep existing remote-path tests intact (no changes needed).

### Rollout

-   [x] Implement behind a minor version bump; update changelog.
-   [ ] Update README and release notes.
-   [x] Validate via `npx baldrick-broth@latest test all`. Note:
    `baldrick-dev-ts release check` only validates version; no need to add
    it here.
