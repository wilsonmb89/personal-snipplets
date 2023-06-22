# pulse-voucher-result



<!-- Auto Generated Below -->


## Properties

| Property                       | Attribute | Description | Type                                | Default     |
| ------------------------------ | --------- | ----------- | ----------------------------------- | ----------- |
| `state`                        | `state`   |             | `"error" \| "pending" \| "success"` | `'success'` |
| `voucherControls` _(required)_ | --        |             | `VoucherControls`                   | `undefined` |
| `voucherHeader` _(required)_   | --        |             | `VoucherHeader`                     | `undefined` |


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

- [pulse-button](../../pulse-atm/button)

### Graph
```mermaid
graph TD;
  pulse-voucher-result --> pulse-button
  pulse-button --> pulse-icon
  pulse-transaction --> pulse-voucher-result
  style pulse-voucher-result fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Team pulse.io! ⭕*
