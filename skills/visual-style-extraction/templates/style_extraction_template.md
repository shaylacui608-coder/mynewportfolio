# Style Extraction Template

## 1. Style Essence Check

visual_type:
  -
not:
  -

判断说明：

## 2. Style Positioning

- 风格类型：
- 使用场景：
- 平台语境：
- 接近的设计语言：

## 3. Core Visual Logic

- 

## 4. Design Quality Logic

Use `design_quality_logic_template.md`.

## 5. Composition System

- 版式骨架：
- 主视觉位置：
- 空间分配：
- 节奏与平衡：

## 6. Element System

- 核心元素：
- 辅助元素：
- 元素抽象方式：
- 元素数量控制：

## 7. Typography System

- 字体角色：
- 字号层级：
- 字形气质：
- 字与图的关系：

## 8. Color System

- 主色：
- 辅色：
- 强调色：
- 色彩关系：

## 9. Texture and Material

- 材质：
- 纹理：
- 光影：
- 不应出现的材质：

## 10. Information Density

- 信息密度：
- 留白策略：
- 装饰密度：

## 11. Mood

- 情绪关键词：
- 商业气质：
- 人群感受：

## 12. Anti-AI Rules

- 

## 13. Style Library YAML

```yaml
style_name:
style_cn:
style_type:
style_essence:
  visual_type:
    -
  not:
    -
core_visual_logic:
  -
design_quality_logic:
  design_sense_from:
    -
  key_design_decisions:
    -
  hierarchy_control:
    -
  layout_intention:
    -
  restraint:
    -
  theme_form_relationship:
    -
  avoid_losing_design_sense:
    -
theme_transfer_rule:
  principle:
  transferable_design_relationships:
    -
  replaceable_surface_elements:
    -
  avoid_when_transferring:
    -
anti_ai_rules:
  -
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

## 14. Production Sanity Check

After writing a reusable style YAML:

1. Assemble a 4:1 test prompt with `scripts/assemble_banner_prompt.py`.
2. Confirm the prompt uses `production_templates/banner_4_1_production.yaml`.
3. Confirm there is no logo requirement or platform logo text.
4. Confirm dish-name mode is explicit:
   - no dish names provided -> no invented dish labels
   - dish names provided -> render exact user-provided names only
5. Confirm real dish photo handling includes natural blending and no visible rectangular cutout borders.

## 15. Final English Prompt

Use `final_image_prompt_template.md`.
