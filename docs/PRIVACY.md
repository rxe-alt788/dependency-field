# Privacy

Dependency maps can expose sensitive information about organisations, authority, bottlenecks, informal workarounds and individuals. Privacy is therefore part of the product architecture rather than an afterthought.

## Current prototype

- Runs entirely in the browser.
- Uses browser local storage for persistence.
- Does not send map data to a server.
- Does not use `fetch`, XHR, WebSocket or beacon calls for map data.
- Export occurs only when the user chooses to download a JSON map.
- Import occurs only when the user selects a JSON file.

## Recommended practice

Users may replace names with roles or pseudonyms such as `Approver A`, `Supplier 1`, or `Engineering` where identity is not analytically necessary.

## Future networked versions

Any future hosted or model-assisted version should preserve a clear distinction between:

1. raw source data;
2. derived dependency structure;
3. generated compression hypotheses;
4. any data deliberately shared outside the user's device.

No future network feature should be treated as implied by the current prototype.
