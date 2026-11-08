# Case 001: Access to a public service

**Status:** illustrative test case  
**Purpose:** test the distinction between required states, pathways and inherited assumptions.

## Outcome

Get an application for a public service approved.

## Target state

The applicant has received approval and can access the service.

## What the case tests

The case separates three things that are easily collapsed into one process checklist:

- **Required states:** the applicant is eligible, a valid authority can grant approval, and the decision-maker has sufficient reliable information.
- **Pathways:** an online form, existing verified records, or an in-person appointment may provide the information needed.
- **Assumption:** the standard online portal is treated as mandatory because it is the normal route.

The central question is whether the applicant must complete a particular administrative step, or whether the underlying information and legal conditions can be satisfied another way.

## Important qualification

This is a structural demonstration, not a description of a named government program or a statement of its legal requirements. Actual eligibility rules, evidence standards, privacy restrictions and lawful access to records must be checked for the service being analysed.

## How to load it

1. Open Dependency Field.
2. Select **Import map JSON**.
3. Choose `examples/government-service.json`.
4. Select **Convert to real dependencies**.
5. Inspect whether the pathway and assumption classifications survive scrutiny.

The case is deliberately small. Its purpose is to test the method, not to model an entire agency.
