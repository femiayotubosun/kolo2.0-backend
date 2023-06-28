declare module '@ioc:Adonis/Core/TestUtils' {
  export interface TestUtilsContract {
    db(connectionName?: string): {
      cmmaSeed: HookCallback
      cmmaMigrate: HookCallback
      cmmaTruncate: HookCallback
    }
  }
}
