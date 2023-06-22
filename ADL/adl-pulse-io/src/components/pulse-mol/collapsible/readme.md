# pulse-collapsible



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute         | Description | Type                                                                                                                                                           | Default     |
| ----------------- | ----------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `carousel`        | `carousel`        |             | `boolean`                                                                                                                                                      | `false`     |
| `description`     | `description`     |             | `string`                                                                                                                                                       | `undefined` |
| `disabled`        | `disabled`        |             | `boolean`                                                                                                                                                      | `false`     |
| `name`            | `name`            |             | `string`                                                                                                                                                       | `undefined` |
| `scrollsize`      | `scrollsize`      |             | `number`                                                                                                                                                       | `300`       |
| `separator`       | `separator`       |             | `boolean`                                                                                                                                                      | `false`     |
| `tagcolor`        | `tagcolor`        |             | `"bouquet" \| "carbon" \| "carbon-light" \| "copper" \| "error" \| "gold" \| "info" \| "olive" \| "primary" \| "scooter" \| "success" \| "warning" \| "white"` | `'success'` |
| `tagcolorvariant` | `tagcolorvariant` |             | `"100" \| "400" \| "700" \| "900"`                                                                                                                             | `'900'`     |
| `tagtext`         | `tagtext`         |             | `string`                                                                                                                                                       | `undefined` |


## Events

| Event                  | Description | Type                   |
| ---------------------- | ----------- | ---------------------- |
| `pulseCollapsibleOpen` |             | `CustomEvent<boolean>` |


## Dependencies

### Depends on

- [pulse-fab-button](../../pulse-atm/fab-button)
- [pulse-tag](../../pulse-atm/tag)
- [pulse-icon](../../pulse-atm/icon)

### Graph
```mermaid
graph TD;
  pulse-collapsible --> pulse-fab-button
  pulse-collapsible --> pulse-tag
  pulse-collapsible --> pulse-icon
  pulse-tag --> pulse-icon
  style pulse-collapsible fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
