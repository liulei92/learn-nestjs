class Test {
  private a=1
  get() {
    return this.a
  }
  set(val) {
    this.a = val
  }
}

const test = new Test()

export default test