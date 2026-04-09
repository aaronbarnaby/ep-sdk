import type { StorageFactory } from '../types'

export class LocalStorageFactory implements StorageFactory {
  private readonly storage: Storage

  constructor(storage: Storage | undefined = globalThis.localStorage) {
    if (!storage) {
      throw new Error('localStorage is not available in this runtime')
    }

    this.storage = storage
  }

  get(key: string): string | null {
    return this.storage.getItem(key)
  }

  set(key: string, value: string): void {
    this.storage.setItem(key, value)
  }

  delete(key: string): void {
    this.storage.removeItem(key)
  }
}

export default LocalStorageFactory
