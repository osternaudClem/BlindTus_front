import { useState } from 'react';

export function useTextfield(defaultValue = '') {
  const [field, setField] = useState(defaultValue);

  const updateField = function (event) {
    if (event && event.target) {
      setField(event.target.value);
      return;
    }
    setField(event);
  }

  return [
    field,
    updateField,
  ];
}

export function useSlider(defaultValue = 0) {
  const [field, setField] = useState(defaultValue);

  const updateField = function (event, newValue) {
    setField(newValue);
  }

  return [
    field,
    updateField,
  ];
}

export function useToggle(defaultValue = false) {
  const [toggle, setToggle] = useState(defaultValue);

  const updateToggle = function () {
    setToggle(t => !t);
  }

  return [
    toggle,
    updateToggle,
  ];
}