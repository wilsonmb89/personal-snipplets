# pulse-option-menu-controller



<!-- Auto Generated Below -->


## Events

| Event         | Description | Type                  |
| ------------- | ----------- | --------------------- |
| `closeChange` |             | `CustomEvent<string>` |


## Methods

### `dismiss<T>(id: any) => Promise<T>`



#### Returns

Type: `Promise<T>`



### `present<T>(properties: PulseMenuData) => Promise<T>`



#### Returns

Type: `Promise<T>`




## Dependencies

### Depends on

- [pulse-option-menu](../option-menu)
- [pulse-option](../option)

### Graph
```mermaid
graph TD;
  pulse-option-menu-controller --> pulse-option-menu
  pulse-option-menu-controller --> pulse-option
  pulse-option-menu --> pulse-card
  pulse-option --> pulse-icon
  style pulse-option-menu-controller fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
