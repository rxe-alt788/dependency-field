# Dependency Field

Dependency Field is a local-first browser instrument for turning ordinary process talk into a clearer structural question:

> **What must actually become true for the target outcome to be true?**

The project is designed for dependency compression work. It distinguishes:

- **required states** — conditions without which the target state cannot occur;
- **pathways** — one or more routes by which a required state may be satisfied;
- **assumptions** — conventional steps or inherited practices that are often treated as requirements but fail the counterfactual test;
- **unresolved items** — things that may matter, but have not yet been sufficiently tested.

## Core idea

Dependency compression should not begin by mapping the normal checklist.

It should begin by converting an outcome into a **target state** and then testing every apparent dependency against that state.

Example:

- Outcome: **Get a job**
- Target state: **I have been hired into acceptable paid work**

From there:

- “An employer knows enough about me to consider hiring me” may be a **required state**.
- “Submit an application to an advertised role” may be a **pathway**.
- “Use a job portal because that is how people normally do it” may be an **assumption**.

## What the prototype does

1. Capture an ordinary-language outcome.
2. Convert it into a target-state formulation.
3. Add candidate items that appear relevant.
4. Test those items against the counterfactual question:
   - **If this never happened, could the target state still occur?**
5. Reclassify items as real dependencies, pathways, assumptions, or unresolved items.
6. Visualise the field.
7. Export/import the map as JSON.

## Interface structure

- **Raw intake** — how the user currently thinks about the situation.
- **Real dependency reading** — the field’s structural interpretation after conversion.

## Privacy

The prototype is local-first. Mapping data is stored in the browser’s local storage and is not transmitted by the application. Users may export/import their own JSON maps.

See [`docs/PRIVACY.md`](docs/PRIVACY.md).

## Run locally

Because the application uses JavaScript modules, serve the repository through a local HTTP server rather than opening `index.html` directly with `file://`.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

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

## Lineage

Dependency Field emerged from work in the Observatory, but is maintained as a separate bounded application with its own interface, purpose, tests and development path.

## Status

Prototype / field test.

Current focus:
- sharpen the target-state translation step;
- improve required-state vs pathway discrimination;
- refine iconography and white-background structural design;
- test whether users can reliably expose hidden assumptions.

## License

No open-source license has yet been selected.
