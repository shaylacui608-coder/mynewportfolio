---
name: visual-style-extraction
description: Extract visual styles from reference images, folders of reference images, or design examples into reusable design-system analysis, style-library YAML, theme-transfer rules, anti-AI rules, quality rubrics, and final English image prompts. Use when Codex is asked to analyze a visual reference, cluster a folder of references by visual style, store a style asset, adapt an existing style to a new theme, create campaign KV or lifestyle poster prompts, or evaluate whether a generated image preserves design sense.
---

# Visual Style Extraction

## Overview

Use this skill to turn visual references into reusable style assets. The goal is not to list visible objects, but to extract the design judgment that makes the reference work and make that judgment portable across themes.

## Required Process

### Step 0. Folder Style Clustering

Use this step when the user provides a folder, a batch of reference images, or multiple design examples.

Before extracting any style YAML, group the references by underlying visual style. Do not create one YAML per image by default.

Use `templates/folder_style_clustering_template.md` and judge grouping by:

- visual type: flat graphic, 2.5D, 3D, photography, illustration, collage, typography-led, campaign KV
- layout skeleton: center aggregation, grid, scattered rhythm, large-type dominant, product-led, scene-led
- hierarchy relationship: typography-led, product-led, character-led, prop-led, information-led
- material system: clay, flat color, realistic photo, glossy commercial render, paper collage, vector graphic
- color logic: high-saturation contrast, restrained editorial palette, festival palette, monochrome, pastel, dark commercial
- information density: hyper-sale density, editorial whitespace, medium campaign density, poster-like minimal density
- design-sense source: typography, composition, material, symbolic translation, whitespace, color collision, graphic rhythm

Output:

1. style groups with image filenames
2. group-level style hypothesis
3. confidence level for each group
4. outliers that should not be merged
5. recommended YAML assets to create

Only after grouping, extract one style YAML per stable style group. If a group contains only a weak or inconsistent match, keep it as an outlier or temporary reference instead of forcing it into the style library.

### Step 1. Style Essence Check

Before describing style, classify the image type:

- flat graphic poster
- 2.5D sticker-like visual
- realistic photography
- commercial 3D rendering
- clay-like 3D
- collage
- typography-led poster
- illustration
- platform campaign KV

State what it is and what it is not. Avoid calling flat high-saturation graphics "3D" only because objects have partial depth.

### Step 2. Extract Core Visual Logic

Explain the underlying visual relationship, not just objects. Identify what relationship gives the image its structure: typography as image, symbolic props, central hero object, scattered rhythm, grid contrast, color-block hierarchy, editorial restraint, or another organizing logic.

### Step 3. Design Quality Logic

Use `templates/design_quality_logic_template.md`. Always explain:

- where the design sense comes from
- the key design decisions
- what shows human control rather than AI randomness
- how hierarchy is established
- what layout skeleton exists
- what is restrained
- what would reduce quality if added
- how the theme is translated into visual form

### Step 4. Extract Visual System

Include:

- style positioning
- composition system
- element system
- typography system
- color system
- texture and material
- information density
- mood
- anti-AI rules

### Step 5. Theme Transfer Calibration

Before changing a theme, output `pre_generation_calibration` from `templates/theme_transfer_template.md`.

Preserve:

- design relationship
- hierarchy
- layout skeleton
- rhythm
- restraint
- symbolic translation method
- visual metaphor

New theme elements must obey the original design system. Do not simply swap objects.

### Step 6. Output

Always output:

1. Chinese style analysis
2. style-library YAML
3. final English image prompt
4. anti-AI rules
5. design quality checklist

### Step 7. Production Profile

When creating a reusable style asset, do not copy a full banner production block into every style YAML.

Instead, add a small `production_profile` block that points to the shared template:

```yaml
production_profile:
  production_template: production_templates/banner_4_1_production.yaml
  supported_outputs:
    - banner_4_1
  default_output: banner_4_1
  title_style:
  subtitle_style:
  background_style:
  composition_preference:
  decoration_requirements:
  information_density:
  anti_ai_emphasis:
```

Use `production_templates/banner_4_1_production.yaml` for common fields such as `final_image_prompt`, `banner_production`, `prompt_assembly_template`, `api_params`, and `dish_clauses`.

## Batch Style Intake Rules

Use these rules whenever the user asks to batch import, batch analyze, or build a style library from a folder of references.

1. Run Folder Style Clustering first.
   - Group images by design system, not by theme or subject.
   - Create one YAML per stable style group, not one YAML per image.
   - Keep weak matches and one-off references as outliers unless the style is very clear.

2. Extract the full style workflow for each stable group.
   - Style Essence Check
   - Core Visual Logic
   - Design Quality Logic
   - Composition System
   - Element System
   - Typography System
   - Color System
   - Texture and Material
   - Information Density
   - Mood
   - Anti-AI Rules
   - Theme Transfer Rule

3. Add `production_profile` to every new style YAML.
   - Point to `production_templates/banner_4_1_production.yaml`.
   - Fill style-specific layout, typography, background, decoration, information-density, and anti-AI emphasis.
   - Do not copy `banner_production`, `prompt_assembly_template`, `api_params`, or `dish_clauses` into each style file.
   - Specify the dominant background pattern mode when the style uses patterned backgrounds: typography texture or pictorial motif texture. Do not mix both by default.
   - When the style uses a solid or painted color block as a title panel, keep the inside of the color block clean behind the main text unless the reference style explicitly textures the block itself.

4. Do not add logo requirements.
   - Do not reserve logo space.
   - Do not insert platform logo text.
   - Do not add brand marks unless the user explicitly provides one as content for a specific generation task.

5. Keep dish-name rendering controlled.
   - If the user provides dish names, render only those exact names beside the corresponding dishes.
   - If no dish names are provided, explicitly prohibit invented dish names, food labels, and menu item names.

6. Preserve real dish assets naturally.
   - When user-provided dish photos are used, preserve their identity.
   - Blend the provided dish photos naturally into the banner background.
   - Remove rectangular photo edges and avoid visible cutout borders.

7. Run a prompt sanity check after intake.
   - Use `scripts/assemble_banner_prompt.py` with the new style YAML.
   - Confirm the assembled prompt includes the selected style DNA, production profile, dish-name mode, and no logo instructions.
   - Only generate images after the prompt reads correctly.

8. Respect excluded styles during category matching.
   - If a style YAML has `exclude_from_category_matching: true`, do not recommend it for spreadsheet/category matching.
   - Do not use excluded styles as fallback fillers. Leave the slot blank instead.
   - Current excluded food-category styles: `现代单品`, `促销图形`, `黏土活动`.

## Style Library Rules

When creating or updating a style asset, write it into `style_library/` and include these fields:

```yaml
style_essence:
  visual_type:
  not:

design_quality_logic:
  design_sense_from:
  key_design_decisions:
  hierarchy_control:
  layout_intention:
  restraint:
  theme_form_relationship:
  avoid_losing_design_sense:

theme_transfer_rule:
  principle:
  transferable_design_relationships:
  replaceable_surface_elements:
  avoid_when_transferring:

anti_ai_rules:

production_profile:
  production_template:
  supported_outputs:
  default_output:
  title_style:
  subtitle_style:
  background_style:
  composition_preference:
  decoration_requirements:
  information_density:
  anti_ai_emphasis:
```

When extracting patterned poster styles, also record the background assembly logic in the relevant style sections:

- color blocks are structure, not wallpaper; keep them clean when they carry primary text
- choose one dominant background pattern mode: typography texture or pictorial motif texture
- if both appear in references, describe which one is primary and which one may only appear as a small accent
- do not let background texture sit under high-priority text if it damages readability or makes the composition feel unplanned

When extracting decorative commercial poster styles, record decoration as slot grammar instead of a flat prop list:

- background pattern mode: choose one dominant paper atmosphere system, such as ghost typography, ingredient line art, regional architecture, botanical pattern, or geometric pattern
- structural color block: define the main title panel, product panel, bottom band, side strip, torn paper shape, or label field
- information ornaments: define seals, stamps, vertical side copy, framed badges, tickets, certificates, side labels, or paper tags that add credibility
- decorative micro-text and small labels: define tiny side notes, boxed labels, stacked text clusters, generic craft words, or provided-title/subtitle fragments used as secondary texture; do not invent dish names, prices, dates, QR content, logos, or unsupported claims
- foreground edge props: define small props that overlap the hero asset, lower edge, side edge, or panel edge to add depth
- connecting brush or line: define brush strokes, steam lines, underlines, dividers, torn-paper edges, trails, or frame fragments that connect title and hero asset
- color blocks are optional composition-balancing devices, not mandatory title or slogan backplates; place them where they coordinate layout, weight, rhythm, or sectioning
- avoid repeating one prop type as the whole decorative system; every decoration must serve a role in atmosphere, structure, information, depth, or connection

## Evaluation Rules

When reviewing a generated image against a style asset, use `rubrics/design_quality_rubric.yaml`.

Score:

- style_essence_match / 20
- design_relationship_preservation / 25
- hierarchy_control / 15
- layout_skeleton / 15
- theme_translation / 15
- anti_ai_quality / 10

Then output total score, pass/fail, key problems, lost design relationships, and revised prompt V2.

## Resources

- `templates/style_extraction_template.md`: structure for extracting a new style from a reference.
- `templates/folder_style_clustering_template.md`: pre-extraction clustering for folders or batches of reference images.
- `templates/design_quality_logic_template.md`: required design-sense judgment block.
- `templates/theme_transfer_template.md`: calibration before adapting a style to a new theme.
- `templates/final_image_prompt_template.md`: final prompt structure.
- `rubrics/design_quality_rubric.yaml`: scoring rules for generated-image review.
- `rubrics/anti_ai_rubric.yaml`: AI-looking failure modes.
- `rubrics/marketing_style_rubric.yaml`: campaign and platform marketing checks.
- `production_templates/banner_4_1_production.yaml`: shared banner production protocol for final prompts, API defaults, asset slots, dish clauses, and prompt assembly.
