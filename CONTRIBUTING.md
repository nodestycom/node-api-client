# Contributing

By participating in this project, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Development

```bash
pnpm install
pnpm check
```

`pnpm check` verifies generated-code drift, formatting, lint rules, TypeScript types, the package build, and runtime tests.

## OpenAPI changes

The API snapshot and generated client are committed so releases are reproducible. Do not edit `openapi/openapi.json` or `src/generated` manually.

```bash
# Download the current Nodesty schema and regenerate the SDK and grouped facade
pnpm generate

# Regenerate from the committed snapshot without network access
pnpm generate:client
```

Review generated request and response type changes before submitting a pull request.

## Pull requests

Keep changes focused and include tests for behavior that is not fully represented by the OpenAPI schema. Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages; release-please uses them to determine package versions and changelog entries.
