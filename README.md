Build a Python-Based Entity–Project Coverage Optimization Tool

1. Objective

Build a Python tool using Pandas that analyzes entity–project coverage data and identifies:

1. Individual entity–project mappings that can be removed without changing any entity’s coverage status.
2. Entire projects that can be removed while preserving the original coverage status of every entity.

The tool must generate both reports in a single Excel output file and provide a validation summary.

2. Input Data

The input will be an Excel or CSV file containing the following columns:

* entity_code: Unique identifier of an entity.
* project_code: Identifier of the project mapped to the entity.
* is_providing_coverage: Boolean indicating whether this project provides coverage for this entity.
* entity_coverage_status: The original coverage status of the entity.

An entity may be mapped to multiple projects, and a project may be mapped to multiple entities.

An entity may have several project mappings, but its coverage status depends on whether at least one mapped project provides coverage.

3. Business Rules

The primary coverage rule is:

* An entity is Covered if at least one of its active project mappings has is_providing_coverage = TRUE.
* An entity is Not Covered if none of its active project mappings has is_providing_coverage = TRUE.

The original entity coverage status must be captured before any optimization starts. This original status is the immutable baseline for all subsequent comparisons.

Do not modify the original input data.

If the supplied entity_coverage_status is inconsistent with the coverage rule, report the discrepancy and stop or request an explicit decision rather than silently overriding the data.

4. Report A: Entity–Project Mapping Optimization

Analyze each mapping independently to identify redundant mappings.

For every entity, calculate the number of distinct mapped projects that provide coverage.

Apply these rules:

* If is_providing_coverage = FALSE, the mapping is individually removable because it does not contribute to the entity’s coverage status.
* If is_providing_coverage = TRUE and the entity has more than one coverage-providing project, mark the mapping as a removal candidate.
* If is_providing_coverage = TRUE and the entity has exactly one coverage-providing project, mark the mapping as mandatory.

Important: Removal candidates must not be interpreted as a set of mappings that can all be deleted simultaneously. For example, if three projects provide coverage for the same entity, at most two of those mappings can be removed while preserving coverage, assuming the other entity mappings remain unchanged.

Include these columns in the mapping report:

* Entity code
* Project code
* Is providing coverage
* Original entity coverage status
* Number of coverage-providing projects
* Mapping recommendation: REMOVE, REMOVE CANDIDATE, or RETAIN
* Reason for the recommendation

Clearly distinguish individually removable candidates from a jointly safe removal plan.

5. Report B: Whole-Project Optimization

The objective is to identify a set of entire projects that can be removed while preserving every entity’s original coverage status.

Implement a greedy algorithm with the following procedure:

Step 1: Initialize

* Store all projects in an active-project set.
* Capture the original coverage status of every entity.
* Initialize an empty list of removed projects.

Step 2: Identify eligible projects

For each active project:

1. Temporarily exclude that project from the active-project set.
2. Recalculate the coverage status of every entity from the remaining active mappings.
3. Compare the recalculated status with the immutable original status.
4. The project is eligible for removal only if every entity’s status remains unchanged.
5. Restore the project if the test fails.

An equivalent optimization is to determine whether the project is the sole coverage provider for any originally covered entity. If it is, the project cannot be removed in the current iteration.

Entities originally Not Covered must remain Not Covered.

Step 3: Select the next project

Among eligible projects, use the following deterministic heuristic:

1. Prefer the project mapped to the fewest distinct entities with is_providing_coverage = TRUE.
2. Break ties by ascending project code.

This is a heuristic for choosing removal order, not a guarantee of the globally optimal solution.

Step 4: Commit one removal

* Remove the selected project from the active-project set.
* Record the project and its removal iteration.
* Recalculate coverage counts and statuses.
* Validate that every entity still matches its original status.

Step 5: Repeat

Repeat eligibility testing, selection, removal, and validation until no remaining project can be safely removed.

Do not select multiple projects based only on eligibility calculated before any removals. Eligibility must be reevaluated after each committed removal.

6. Coverage Status Recalculation

Recalculate status from the remaining active project mappings, rather than trusting the original status column or a stale provider count.

Conceptually:

For each entity:

* Filter the original dataset to mappings whose project remains active.
* Check whether any remaining mapping has is_providing_coverage = TRUE.
* If yes, set the recalculated status to Covered.
* Otherwise, set it to Not Covered.
* If the entity has no remaining mappings, treat it as having zero coverage providers.

Compare this recalculated status against the original baseline for every entity, including entities that have lost all their mappings.

A proposed removal must be committed only if this comparison passes for all entities.

7. Project Optimization Report Columns

Generate one row per project, including:

* Project code
* Number of distinct mapped entities
* Number of entities for which the project provides coverage
* Removal iteration
* Removal recommendation: REMOVED, RETAINED, or BLOCKED
* Reason for the recommendation
* Entities that would lose coverage if the project were removed at the point it was evaluated
* Alternative active projects providing coverage for those entities

For projects retained at the end, explain why they could not be removed. Distinguish between a project that was never eligible and one that became ineligible after other removals.

8. Validation and Summary

After the greedy algorithm completes:

1. Recalculate coverage status using only the remaining active projects.
2. Compare final status with the original status for every entity.
3. Assert that no entity’s status has changed.
4. Report any discrepancy with the affected entity codes.
5. Report the number of original projects, projects removed, projects retained, original mappings, mapping candidates, and final coverage providers.
6. State clearly that the greedy algorithm finds a maximal safe removal sequence but does not necessarily find the globally minimum set of retained projects.

Do not claim success if validation fails.

9. Excel Output

Create an Excel file named coverage_optimization_report.xlsx containing these worksheets:

1. Mapping Report — mapping-level recommendations.
2. Project Report — whole-project recommendations and removal sequence.
3. Entity Validation — original status, final status, original provider count, final provider count, and validation result for every entity.
4. Summary — overall optimization statistics and validation outcome.

Use Pandas and openpyxl to generate a readable Excel workbook with column headers, filters, sensible column widths, and frozen header rows.

10. Engineering Requirements

* Use Python and Pandas.
* Support Excel and CSV input.
* Validate required columns and Boolean values.
* Handle duplicate entity–project rows explicitly; do not silently count duplicate rows as distinct projects.
* Handle entities that have no remaining mappings.
* Preserve original input data.
* Keep the implementation modular, with separate functions for loading and validating data, calculating coverage status, generating the mapping report, running project optimization, validating results, and exporting reports.
* Include comments and error handling.
* Provide executable Python code and instructions for running it locally.

11. Important Scope Clarification

Mapping-level and project-level optimization are separate operations.

The mapping report identifies individual candidates based on the original data. The project report identifies a safe sequence of whole-project removals.

Do not automatically apply every mapping-level candidate to the project-level analysis. Do not combine the two removal plans unless a separate, explicitly defined combined optimization strategy is implemented.

The primary acceptance criterion is that the final entity coverage status exactly matches the original entity coverage status for every entity.
