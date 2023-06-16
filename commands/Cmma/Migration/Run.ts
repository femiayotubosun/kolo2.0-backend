import { BaseCmmaMigrationCommand } from '../../../cmma/BaseCommands/BaseCmmaMigrationCommand'
import { flags } from '@adonisjs/core/build/standalone'
import { CmmaMigratorContract } from '../../../cmma/Helpers/Migration/CmmaMigratorContract'

export default class Run extends BaseCmmaMigrationCommand {
  /*
  |--------------------------------------------------------------------------------
  | ACE Command Configuration
  |--------------------------------------------------------------------------------
  |
  */
  public static commandName = 'cmma:migration-run'
  public static description = 'Migrate database by running pending CMMA Migrations'
  public static settings = {
    loadApp: true,
  }

  /*
 |--------------------------------------------------------------------------------
 | CMMA Configuration
 |--------------------------------------------------------------------------------
 |
 */
  protected commandShortCode = 'mig|run'
  protected targetEntity = ''

  /*
  |--------------------------------------------------------------------------------
  | Lucid's Run Migration Command Properties and Flags
  |--------------------------------------------------------------------------------
  |
  */
  private migrator: CmmaMigratorContract

  /**
   * Custom connection for running migrations.
   */
  @flags.string({ description: 'Define a custom database connection', alias: 'c' })
  public connection: string

  /**
   * Force run migrations in production
   */
  @flags.boolean({ description: 'Explicitly force to run migrations in production' })
  public force: boolean

  /**
   * Perform dry run
   */
  @flags.boolean({ description: 'Do not run actual queries. Instead view the SQL output' })
  public dryRun: boolean

  /**
   * Display migrations result in one compact single-line output
   */
  @flags.boolean({ description: 'A compact single-line output' })
  public compactOutput: boolean = false

  /**
   * Disable advisory locks
   */
  @flags.boolean({ description: 'Disable locks acquired to run migrations safely' })
  public disableLocks: boolean

  /**
   * Instantiating the migrator instance
   */
  private instantiateMigrator() {
    const db = this.application.container.use('Adonis/Lucid/Database')
    this.application.container.resolveBinding('Adonis/Lucid/Migrator')

    this.migrator = new CmmaMigratorContract(
      db,
      this.application,
      {
        direction: 'up',
        connectionName: this.connection,
        dryRun: this.dryRun,
        disableLocks: this.disableLocks,
      },
      this.PROJECT_CONFIG
    )
  }

  /**
   * Run as a subcommand. Never close database connections or exit
   * process inside this method
   */
  private async runAsSubCommand() {
    const db = this.application.container.use('Adonis/Lucid/Database')
    this.connection = this.connection || db.primaryConnectionName

    /**
     * Overwrite connection paths with CMMA Paths
     */

    /**
     * Continue with migrations when not in prod or force flag
     * is passed
     */
    let continueMigrations = !this.application.inProduction || this.force
    if (!continueMigrations) {
      continueMigrations = await this.takeProductionConstent()
    }

    /**
     * Do not continue when in prod and the prompt was cancelled
     */
    if (!continueMigrations) {
      return
    }

    /**
     * Invalid database connection
     */
    if (!db.manager.has(this.connection)) {
      this.printNotAValidConnection(this.connection)
      this.exitCode = 1
      return
    }

    this.instantiateMigrator()
    console.log('To Run Migrations')
    await this.runMigrations(this.migrator, this.connection)
  }

  /**
   * Branching out, so that if required we can implement
   * "runAsMain" separately from "runAsSubCommand".
   *
   * For now, they both are the same
   */
  private async runAsMain() {
    await this.runAsSubCommand()
  }

  /**
   * Handle command
   */
  public async run(): Promise<void> {
    await this.ensureConfigFileExistsCommandStep()

    if (this.isMain) {
      await this.runAsMain()
    } else {
      await this.runAsSubCommand()
    }

    await this.finishCmmaCommand()
  }

  /**
   * Lifecycle method invoked by ace after the "run"
   * method.
   */
  public async completed() {
    if (this.migrator && this.isMain) {
      await this.migrator.close()
    }
  }
}
