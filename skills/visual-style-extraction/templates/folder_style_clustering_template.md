# Folder Style Clustering Template

Use this template before extracting styles when the input is a folder, batch, contact sheet, or multiple reference images.

## 1. Inventory

List all references with stable filenames or labels.

```yaml
reference_inventory:
  - file:
    visible_theme:
    first_impression_style:
    notes:
```

## 2. Style Grouping Criteria

Group by design system, not by topic.

Judge each image by:

- visual type: flat graphic, 2.5D, clay 3D, commercial 3D, photography, illustration, collage, typography-led, campaign KV
- layout skeleton: center aggregation, grid, scattered rhythm, large-type dominant, product-led, scene-led
- hierarchy relationship: typography-led, product-led, character-led, prop-led, information-led
- material system: clay, flat color, realistic photo, glossy render, paper collage, vector graphic
- color logic: high-saturation contrast, restrained editorial palette, festival palette, monochrome, pastel, dark commercial
- information density: hyper-sale density, editorial whitespace, medium campaign density, poster-like minimal density
- design-sense source: typography, composition, material, symbolic translation, whitespace, color collision, graphic rhythm

Do not group images only because they share the same business theme, holiday, product category, or subject matter.

## 3. Required Output

```yaml
folder_style_clustering:
  summary:
    total_references:
    stable_style_group_count:
    outlier_count:

  style_groups:
    - group_id:
      proposed_style_name:
      confidence: high | medium | low
      files:
        -
      shared_style_essence:
        visual_type:
          -
        layout_skeleton:
          -
        hierarchy_relationship:
          -
        material_system:
          -
        color_logic:
          -
        information_density:
          -
        design_sense_source:
          -
      why_these_belong_together:
        -
      differences_allowed_inside_group:
        -
      should_extract_yaml: true
      recommended_yaml_filename:

  outliers:
    - file:
      reason:
      closest_group:
      recommendation: keep_separate | ignore_for_now | needs_more_references

  extraction_plan:
    - order:
      group_id:
      extraction_strategy:
      representative_files:
        -
```

## 4. Decision Rules

- If two images share theme but differ in visual type, material, hierarchy, and layout skeleton, separate them.
- If two images differ in subject matter but share layout skeleton, material, hierarchy, and design-sense source, group them.
- If a group has fewer than two references, mark confidence as low unless the style is very clear.
- If a reference is attractive but inconsistent with all groups, keep it as an outlier instead of forcing it into a YAML.
- Create one YAML per stable style group, not one YAML per file.
