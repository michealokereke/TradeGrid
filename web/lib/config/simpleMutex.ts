// src/shared/api/simpleMutex.ts
export class Mutex {
  private _locked = false;
  private _resolvers: Array<() => void> = [];

  isLocked() {
    return this._locked;
  }

  async acquire(): Promise<() => void> {
    if (!this._locked) {
      this._locked = true;
      return this._release.bind(this);
    }
    await new Promise<void>((resolve) => this._resolvers.push(resolve));
    this._locked = true;
    return this._release.bind(this);
  }

  private _release() {
    this._locked = false;
    const resolve = this._resolvers.shift();
    if (resolve) resolve();
  }

  async waitForUnlock(): Promise<void> {
    if (!this._locked) return;
    await new Promise<void>((resolve) => this._resolvers.push(resolve));
  }
}
