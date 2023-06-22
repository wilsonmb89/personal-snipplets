# pulse-mobile-calendar



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute        | Description | Type                                                                                                                                                           | Default     |
| -------------------------- | ---------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `color`                    | `color`          |             | `"bouquet" \| "carbon" \| "carbon-light" \| "copper" \| "error" \| "gold" \| "info" \| "olive" \| "primary" \| "scooter" \| "success" \| "warning" \| "white"` | `'primary'` |
| `currentDate` _(required)_ | --               |             | `Date`                                                                                                                                                         | `undefined` |
| `maxdate`                  | --               |             | `Date`                                                                                                                                                         | `undefined` |
| `mindate`                  | --               |             | `Date`                                                                                                                                                         | `undefined` |
| `selecteddays`             | --               |             | `Date[]`                                                                                                                                                       | `[]`        |
| `showmonthtitle`           | `showmonthtitle` |             | `boolean`                                                                                                                                                      | `true`      |


## Events

| Event          | Description | Type                |
| -------------- | ----------- | ------------------- |
| `dateSelected` |             | `CustomEvent<Date>` |


## Dependencies

### Used by

 - [pulse-mobile-calendar-group](../../pulse-mol/mobile-calendar-group)
 - [pulse-mobile-date-picker](../../pulse-mol/mobile-date-picker)

### Graph
```mermaid
graph TD;
  pulse-mobile-calendar-group --> pulse-mobile-calendar
  pulse-mobile-date-picker --> pulse-mobile-calendar
  style pulse-mobile-calendar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
