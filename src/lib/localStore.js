import { writable, get as getStoreValue } from 'svelte/store';

export function newLocalStore(key, initial) {
  let store = writable();
  let value;
  let local = window?.localStorage?.getItem(key);
  if (local) {
    try {
      value = JSON.parse(local);
    } catch {
      value = initial;
    }
  } else {
    value = initial;
  }

  function get() {
    return getStoreValue(store);
  }

  function set(value) {
    store.set(value);
    window?.localStorage?.setItem(key, JSON.stringify(value));
  }
  function update(func) {
    store.update(func);
    window?.localStorage?.setItem(key, JSON.stringify(get(store)));
  }
  set(value);

  return {
    subscribe: store.subscribe,
    set,
    update,
    get
  };
}
