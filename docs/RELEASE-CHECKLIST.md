# Prototype release checklist

This checklist defines what must be checked before calling the current application a finished first release.

## Current identifiers

Use identifiers that already correspond to real project artefacts:

- Repository: `dependency-field`
- Demonstration case: `CASE-001`
- Export format: `dependency-field/v2`
- Immutable change reference: the Git commit SHA

Do not assign a financial ticker. This is a software project, not a listed instrument. Use a release tag such as `v0.1.0` only after the checks below pass.

## Deployment

- [ ] GitHub Actions validation and deployment workflow completes successfully.
- [ ] GitHub Pages serves the application from the intended repository.
- [ ] The deployed application loads its HTML, stylesheet and JavaScript without console errors.

## Core use

- [ ] Set an outcome and a target state.
- [ ] Add candidate items and connect them to the target or another item.
- [ ] Edit the item description, basis, owner and counterfactual answer.
- [ ] Remove an item and confirm its children are retained safely.
- [ ] Run the structural assessment.
- [ ] Confirm the assessment describes candidate requirements and assumptions provisionally, not as independently verified facts.
- [ ] Switch between the raw intake and structural assessment views.

## Data integrity

- [ ] Import `examples/government-service.json`.
- [ ] Export the imported map.
- [ ] Import the exported file and confirm the outcome, target state, items and relationships are retained.
- [ ] Refresh the browser and confirm local persistence.
- [ ] Reset the field and confirm the reset is complete.

## Privacy and public presentation

- [ ] Confirm map data remains in browser storage and is not sent to a server.
- [ ] Review external asset requests, including web fonts, and describe them accurately in the privacy note.
- [ ] Confirm the public-service example is clearly described as illustrative, not legal advice or a claim about a named agency.
- [ ] Choose a software licence before inviting public contributions or presenting the repository as open source.

## Release decision

The first release is ready when deployment, core use and data-integrity checks pass. Privacy wording and licensing must be settled before making broader claims about public use or inviting contributions.

Until then, describe the project as a prototype / field test. Do not imply that its classifications have been empirically validated.
