# Initial Category Style Mapping

This folder stores the first category-to-style mapping in an agent-readable format.

## Files

- `initial_category_style_mapping.agent.json`: canonical file for agents and workflow nodes.
- `initial_category_style_mapping.agent.csv`: flat table for spreadsheet review.

## Agent Lookup Rule

1. Match merchant category by `new_type_code`, or by `category_l2 + category_l3`.
2. Use `recommended_style.style_name` as the default style YAML key.
3. For multi-style tests, use `style_candidates` in rank order.
4. If fewer than three styles exist, leave the rest empty. Do not invent styles.
5. Use `style_cn` only for human display; use `style_name` for YAML/prompt lookup.

## Initial Excluded Styles

- `现代单品` / `modernist_product_editorial`: excluded from the initial food-poster matching table.
- `促销图形` / `flat_hyper_sale_graphic_kv`: excluded from the initial food-poster matching table.
- `黏土活动` / `douyin_clay_3d_life_sale_kv`: excluded from the initial food-poster matching table.
