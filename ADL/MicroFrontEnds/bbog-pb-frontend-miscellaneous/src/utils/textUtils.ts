import React from 'react';

export const diacriticInputText = (event: React.FormEvent<HTMLInputElement>): void => {
  event.currentTarget.value = event.currentTarget.value
    .replace(/[\u0300-\u036f´`¨]/g, '')
    .replace(/[^A-Za-z0-9 ]+/g, '');
};
