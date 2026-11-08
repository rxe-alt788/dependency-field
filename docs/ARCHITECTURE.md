# Dependency Field Architecture

## Design stance

Dependency Field is not a process-mapping tool in the ordinary sense.

It is a structural translation instrument.

The architecture is deliberately oriented around four layers:

1. **Outcome language**
2. **Target state**
3. **Candidate items**
4. **Structural reading**

The crucial transformation happens between layers 1 and 2.

A user usually begins with an ordinary request or intention:

- get a job
- secure project approval
- launch the service
- obtain funding

The system asks the user to convert that intention into a state that, if true, would mean the outcome has occurred.

Examples:

- “get a job” → “I have been hired into acceptable paid work”
- “secure project approval” → “the project is approved and able to proceed”

Once a target state exists, all other items are tested against it.

## Objects

### Outcome
The user’s plain-language articulation of what they are trying to get done.

### Target state
The necessary condition anchor.

### Candidate item
Something the user believes matters.

Each candidate item currently stores:

- label
- current treatment (`required`, `pathway`, `assumption`, `blocker`)
- parent/enables relationship
- stated basis
- owner/role
- counterfactual answer
- optional notes

### Structural reading
A derived interpretation of the candidate item.

Possible readings:

- **required** — a candidate condition assessed as necessary under the current target-state definition
- **pathway** — a route, but not a necessary condition
- **assumption** — currently treated as necessary, but its necessity is not established by the available information
- **unresolved** — more inquiry required

## Core rule

 > A candidate strict dependency is a condition the target state appears unable to occur without, within a clearly stated scope. The counterfactual answer is a screening judgement, not proof.

The prototype records the user's counterfactual judgement. It does not independently verify the judgement or establish legal, technical or operational necessity.

## Views

### Raw intake
Shows the map according to the user’s current framing.

### Structural assessment
Shows a provisional assessment after applying the counterfactual screen.

The visual language is intentionally stark:

- white background
- black/charcoal base typography
- one blue accent
- semantic icons/shapes

This separates Dependency Field from the darker, more reflective visual language of the Observatory.

## Persistence

The prototype is local-first.

State is stored in browser local storage and can be exported/imported as JSON.

## Current limitations

- target-state suggestion is heuristic and intentionally lightweight;
- structural reading depends heavily on user-supplied counterfactual judgments;
- no multi-map workspace yet;
- no version history yet;
- no advanced graph analytics yet.
