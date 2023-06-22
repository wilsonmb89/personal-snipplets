# pulse-select-card



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description | Type                | Default     |
| ------------ | ------------ | ----------- | ------------------- | ----------- |
| `disabled`   | `disabled`   |             | `boolean`           | `false`     |
| `selected`   | `selected`   |             | `boolean`           | `false`     |
| `switchtype` | `switchtype` |             | `"none" \| "radio"` | `"none"`    |
| `value`      | `value`      |             | `any`               | `undefined` |


## Events

| Event         | Description                               | Type               |
| ------------- | ----------------------------------------- | ------------------ |
| `sCardSelect` | Emitted when the select card is selected. | `CustomEvent<any>` |


## Dependencies

### Depends on

- [pulse-radio](../radio)

### Graph
```mermaid
graph TD;
  pulse-select-card --> pulse-radio
  style pulse-select-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
