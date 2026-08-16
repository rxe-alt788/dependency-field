# Architecture

## Boundary

Dependency Field is a standalone application. It does not require the Observatory runtime and does not write to Observatory records.

## Data flow

```text
Outcome
  ↓
Raw dependencies
  ↓
Dependency basis + type + strength
  ↓
Diagnostic tests
  ↓
Current dependency graph
  ↓
Compression hypotheses
  ↓
Human review
```

## Dependency classes

- information
- approval / authority
- sequence
- resource
- coordination
- institutional / policy
- technical
- unknown

## Strength states

- hard
- soft
- assumed
- unknown

## Compression treatments

- challenge / remove
- remove / reduce
- parallelise
- replace path
- pre-authorise / delegate
- standardise / expose information earlier
- combine decision point
- test sequence
- retain
- inspect further

## Governing rule

Compression is not automatic optimisation. A dependency should be changed only when its function, basis and consequences are sufficiently understood.

## Local-first runtime

The prototype is static HTML/CSS/JavaScript. User maps remain in browser local storage unless explicitly exported by the user.
