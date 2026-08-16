# Observatory Integration Contract

Dependency Field and Observatory are separate projects with shared lineage.

## Observatory → Dependency Field

Observatory may provide a sufficiently formed goal, project or canonical entity as the starting outcome for a dependency analysis.

## Dependency Field → Observatory

Dependency Field may return:

- dependency nodes;
- dependency relationships;
- basis and strength states;
- uncertainty;
- compression candidates;
- retained dependencies;
- a before/after hypothesis.

## Boundary rule

Dependency Field must not overwrite the originating Observatory source or canonical entity. Any returned analysis remains a derived representation until deliberately accepted by the user.

## Why separate repositories

The separation prevents:

- a commercial or operational use case from redefining the Observatory;
- Observatory philosophy from becoming mandatory interface overhead for ordinary dependency analysis;
- shared code from creating unnecessary coupling;
- experimentation in one project from destabilising the other.
