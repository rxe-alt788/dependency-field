# Dependency Field

Dependency Field is a local-first browser instrument for mapping the dependencies around an outcome and testing which dependencies are genuinely binding, merely inherited, informational, sequential, assumed, or compressible.

The core question is deliberately plain:

> **What has to happen before this can happen?**

The project was developed from work in the Observatory, but it is now maintained as a separate bounded application with its own purpose, interface, tests and development path.

## What it does

1. Define an intended outcome.
2. Add dependencies and dependencies-of-dependencies.
3. Record type, strength, basis and owner/role.
4. Interrogate dependencies with failure, authority, alternative-path, parallel, information and inheritance tests.
5. Display the current dependency field.
6. Generate compression candidates such as remove/reduce, parallelise, replace path, delegate/pre-authorise, standardise information, combine decision points, test sequence, retain or inspect further.
7. Compare the current field with a compression hypothesis.

## Principle

**Dependency compression is not the removal of friction. It is the examination of whether each dependency still performs a defensible function relative to the intended outcome.**

A dependency may be real without being permanent. A dependency may also be inconvenient and still be necessary.

## Privacy

The current prototype is local-first. Mapping data is stored in the browser's local storage and is not transmitted by the application. Users may export or import their own JSON maps. See [`docs/PRIVACY.md`](docs/PRIVACY.md).

## Run locally

Because the application uses JavaScript modules, serve the directory through a local HTTP server rather than opening `index.html` through `file://`.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Repository structure

```text
index.html
 dependency.css
 dependency.js
 README.md
 docs/
   ARCHITECTURE.md
   METHODOLOGY.md
   PRIVACY.md
   TESTS.md
   OBSERVATORY_INTEGRATION.md
 examples/
   example-map.json
```

## Status

Prototype / field test. The interface is intended to prove whether guided dependency mapping reveals hidden dependencies before additional automation or model reasoning is introduced.

## Lineage

Dependency Field emerged from the Observatory's source → relationship → form architecture. The projects are deliberately separate: Observatory remains a broader framework; Dependency Field is a bounded instrument for dependency analysis.

## License

No open-source license has yet been selected. Public visibility does not itself grant reuse rights.
