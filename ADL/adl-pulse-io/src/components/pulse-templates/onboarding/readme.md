# pulse-onboarding



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                    | Default     |
| -------- | --------- | ----------- | ----------------------- | ----------- |
| `data`   | --        |             | `PulseOnBoardingItem[]` | `undefined` |


## Events

| Event             | Description                                                                               | Type                   |
| ----------------- | ----------------------------------------------------------------------------------------- | ---------------------- |
| `showButtonEvent` | The state of the last slide. For more information, see [theming](https://pulseio.design). | `CustomEvent<boolean>` |


## Dependencies

### Depends on

- [pulse-slides](../../pulse-mol/slides)
- [pulse-slide](../../pulse-mol/slide)

### Graph
```mermaid
graph TD;
  pulse-onboarding --> pulse-slides
  pulse-onboarding --> pulse-slide
  pulse-slides --> pulse-fab-button
  pulse-slides --> pulse-progress-indicator
  style pulse-onboarding fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
