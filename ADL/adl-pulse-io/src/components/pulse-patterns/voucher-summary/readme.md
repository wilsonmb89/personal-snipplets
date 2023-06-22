# pulse-voucher-summary



<!-- Auto Generated Below -->


## Properties

| Property                       | Attribute | Description | Type                                | Default     |
| ------------------------------ | --------- | ----------- | ----------------------------------- | ----------- |
| `state`                        | `state`   |             | `"error" \| "pending" \| "success"` | `'success'` |
| `voucherBody` _(required)_     | --        |             | `VoucherBody`                       | `undefined` |
| `voucherControls` _(required)_ | --        |             | `VoucherControls`                   | `undefined` |


## Events

| Event              | Description | Type               |
| ------------------ | ----------- | ------------------ |
| `mailclicked`      |             | `CustomEvent<any>` |
| `mainclicked`      |             | `CustomEvent<any>` |
| `secondaryclicked` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pulse-transaction](../../pulse-pages/transaction)

### Depends on

- [pulse-voucher-summary-item](../voucher-summary-item)
- [pulse-tag](../../pulse-atm/tag)
- [pulse-button](../../pulse-atm/button)

### Graph
```mermaid
graph TD;
  pulse-voucher-summary --> pulse-voucher-summary-item
  pulse-voucher-summary --> pulse-tag
  pulse-voucher-summary --> pulse-button
  pulse-tag --> pulse-icon
  pulse-button --> pulse-icon
  pulse-transaction --> pulse-voucher-summary
  style pulse-voucher-summary fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
