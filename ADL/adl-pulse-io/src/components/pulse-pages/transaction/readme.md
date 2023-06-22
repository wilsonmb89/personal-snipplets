# pulse-transaction



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute | Description | Type           | Default     |
| -------------------------- | --------- | ----------- | -------------- | ----------- |
| `voucherdata` _(required)_ | --        |             | `VoucherModel` | `undefined` |


## Events

| Event                    | Description | Type               |
| ------------------------ | ----------- | ------------------ |
| `mailactionclicked`      |             | `CustomEvent<any>` |
| `mainactionclicked`      |             | `CustomEvent<any>` |
| `secondaryactionclicked` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [pulse-flowthc](../../pulse-templates/flowthc)
- [pulse-flowth](../../pulse-templates/flowth)
- [pulse-voucher](../../pulse-templates/voucher)
- [pulse-voucher-result](../../pulse-patterns/voucher-result)
- [pulse-voucher-summary](../../pulse-patterns/voucher-summary)

### Graph
```mermaid
graph TD;
  pulse-transaction --> pulse-flowthc
  pulse-transaction --> pulse-flowth
  pulse-transaction --> pulse-voucher
  pulse-transaction --> pulse-voucher-result
  pulse-transaction --> pulse-voucher-summary
  pulse-voucher-result --> pulse-button
  pulse-button --> pulse-icon
  pulse-voucher-summary --> pulse-voucher-summary-item
  pulse-voucher-summary --> pulse-tag
  pulse-voucher-summary --> pulse-button
  pulse-tag --> pulse-icon
  style pulse-transaction fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
