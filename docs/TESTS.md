# Tests

## Functional

1. Set an outcome.
2. Add a direct dependency.
3. Add a dependency whose parent is another dependency.
4. Edit diagnostic answers in the inspector.
5. Run compression analysis.
6. Switch between Current field and Compression hypothesis.
7. Remove a parent dependency and verify children are safely re-parented.
8. Export JSON and import it again.
9. Refresh the browser and verify local persistence.
10. Reset the field.

## Falsification

The prototype fails if:

- every dependency is treated as a compression opportunity;
- hard dependencies are casually marked removable;
- assumed dependencies are presented as facts;
- the compression view silently alters the source map;
- removing a node loses its children;
- private map data leaves the browser without explicit user action;
- the mobile interface prevents map inspection or data entry.

## Static validation

- HTML parses without structural errors.
- JavaScript passes syntax checking.
- runtime contains no map-data network transmission path.
