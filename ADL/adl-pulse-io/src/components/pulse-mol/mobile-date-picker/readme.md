# pulse-mobile-calendar



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute           | Description | Type                                                                                                                                                           | Default     |
| ------------------- | ------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `color`             | `color`             |             | `"bouquet" \| "carbon" \| "carbon-light" \| "copper" \| "error" \| "gold" \| "info" \| "olive" \| "primary" \| "scooter" \| "success" \| "warning" \| "white"` | `'primary'` |
| `endlabel`          | `endlabel`          |             | `string`                                                                                                                                                       | `''`        |
| `maxdate`           | --                  |             | `Date`                                                                                                                                                         | `undefined` |
| `mindate`           | --                  |             | `Date`                                                                                                                                                         | `undefined` |
| `monthsrenderrange` | `monthsrenderrange` |             | `number`                                                                                                                                                       | `2`         |
| `range`             | `range`             |             | `boolean`                                                                                                                                                      | `false`     |
| `startlabel`        | `startlabel`        |             | `string`                                                                                                                                                       | `''`        |


## Events

| Event              | Description | Type                  |
| ------------------ | ----------- | --------------------- |
| `confirmSelection` |             | `CustomEvent<Date[]>` |
| `goBack`           |             | `CustomEvent<any>`    |


## Dependencies

### Depends on

- [pulse-input](../../pulse-atm/input)
- [pulse-flowth](../../pulse-templates/flowth)
- [pulse-nav-button](../../pulse-atm/nav-button)
- [pulse-mobile-calendar](../../pulse-atm/mobile-calendar)
- [pulse-button](../../pulse-atm/button)

### Graph
```mermaid
graph TD;
  pulse-mobile-date-picker --> pulse-input
  pulse-mobile-date-picker --> pulse-flowth
  pulse-mobile-date-picker --> pulse-nav-button
  pulse-mobile-date-picker --> pulse-mobile-calendar
  pulse-mobile-date-picker --> pulse-button
  pulse-input --> pulse-icon
  pulse-nav-button --> pulse-icon
  pulse-button --> pulse-icon
  style pulse-mobile-date-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
