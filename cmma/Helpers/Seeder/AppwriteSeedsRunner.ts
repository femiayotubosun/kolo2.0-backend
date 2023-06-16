import CmmaNodePath from '../../Models/CmmaNodePath'
import CmmaConfiguration from '../../Models/CmmaConfiguration'
import CmmaProjectMapActions from '../../Actions/CmmaProjectMapActions'
import CmmaContextActions from '../../Actions/CmmaContextActions'
import CmmaSystemActions from '../../Actions/CmmaSystemActions'
import importFile from '../importFile'
import AppwriteSeederInterface from '../../../app/Common/TypeChecking/GeneralPurpose/AppwriteSeederInterface'

export default class AppwriteSeedsRunner {
  constructor(private cmmaConfiguration: CmmaConfiguration, private appRoot: string) {}

  public getSeedsList() {
    const projectAppwriteSeeders: Array<CmmaNodePath> = []

    const projectContexts = CmmaProjectMapActions.listContextsInProject(
      this.cmmaConfiguration.projectMap
    )

    projectContexts.map((contextLabel) => {
      const contextMap = CmmaProjectMapActions.getContextMapByLabel({
        projectMap: this.cmmaConfiguration.projectMap,
        contextLabel,
      })

      const contextSystems = CmmaContextActions.listSystemsInContext(contextMap)

      contextSystems.forEach((systemLabel) => {
        const systemMap = CmmaContextActions.getContextSystemMapByLabel({
          contextMap,
          systemLabel,
        })

        const systemAppwriteSeeders = CmmaSystemActions.listSystemAppwriteSeeders({
          systemMap,
          configObject: this.cmmaConfiguration,
        })

        systemAppwriteSeeders.forEach((appwriteSeeder) => {
          const seederNodePath = new CmmaNodePath(this.cmmaConfiguration)
            .buildPath()
            .toContext(contextLabel)
            .toSystem(systemLabel)
            .toArtifactsDir('seeders')
            .toArtifactWithoutExtension({
              artifactType: 'file',
              artifactLabel: appwriteSeeder,
            })

          projectAppwriteSeeders.push(seederNodePath)
        })
      })
    })

    return projectAppwriteSeeders.map((seederPath) => seederPath.getAbsoluteOsPath(this.appRoot))
  }

  public async run() {
    for (let seed of this.getSeedsList()) {
      const seederInstance: AppwriteSeederInterface = await importFile(seed)

      await seederInstance.run()
    }
  }
}
