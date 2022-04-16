export class EventManager {
  node: any;
  funcs: {
    [key: string]:() => void;
  };
  constructor(node: any) {
    this.node = node;
    this.funcs = {};
  }

  add(type: string, fn: () => void) {
    this.funcs[type] = fn;
    console.log(this.funcs)
    this.node.addEventListener(type, fn);
  }

  removeAll(type: string) {
    if (!this.funcs[type]) return;
    this.node.removeEventListener(type, this.funcs[type]);
  }
}