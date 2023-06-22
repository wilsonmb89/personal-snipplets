# pulse-date-picker



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute    | Description | Type                                                                                                                                                           | Default     |
| -------------------- | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `color`              | `color`      |             | `"bouquet" \| "carbon" \| "carbon-light" \| "copper" \| "error" \| "gold" \| "info" \| "olive" \| "primary" \| "scooter" \| "success" \| "warning" \| "white"` | `'primary'` |
| `disabled`           | `disabled`   |             | `boolean`                                                                                                                                                      | `false`     |
| `endlabel`           | `endlabel`   |             | `string`                                                                                                                                                       | `''`        |
| `maxDate`            | --           |             | `Date`                                                                                                                                                         | `undefined` |
| `minDate`            | --           |             | `Date`                                                                                                                                                         | `undefined` |
| `range`              | `range`      |             | `boolean`                                                                                                                                                      | `false`     |
| `startlabel`         | `startlabel` |             | `string`                                                                                                                                                       | `''`        |
| `value` _(required)_ | --           |             | `Date[]`                                                                                                                                                       | `undefined` |


## Events

| Event              | Description | Type                  |
| ------------------ | ----------- | --------------------- |
| `datePickerChange` |             | `CustomEvent<Date[]>` |


## Dependencies

### Depends on

- [pulse-input](../../pulse-atm/input)
- [pulse-calendar](../calendar)

### Graph
```mermaid
graph TD;
  pulse-date-picker --> pulse-input
  pulse-date-picker --> pulse-calendar
  pulse-input --> pulse-icon
  pulse-calendar --> pulse-option-menu
  pulse-calendar --> pulse-option
  pulse-calendar --> pulse-card
  pulse-option-menu --> pulse-card
  pulse-option --> pulse-icon
  style pulse-date-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
