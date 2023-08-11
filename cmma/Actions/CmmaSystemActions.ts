import CmmaSystem from '../Models/CmmaSystem'
import CmmaModule from '../Models/CmmaModule'
import CmmaArtifact from '../Models/CmmaArtifact'
import CmmaArtifactsGroup from '../Models/CmmaArtifactsGroup'
import CmmaArtifactDirs from '../TypeChecking/CmmaArtifactDirs'
import CmmaAbstractArtifactEnum from '../TypeChecking/AbstractArtifact/CmmaAbstractArtifactEnum'
import CmmaConfiguration from '../Models/CmmaConfiguration'
import CmmaConfigurationActions from './CmmaConfigurationActions'

export default class CmmaSystemActions {
  /**
   * @description Add a CmmaModule To a System
   * @author ƒa†3
   * @param {} addModuleToSystemOptions
   */
  public static addModuleToSystem(addModuleToSystemOptions: {
    moduleLabel: string
    module: CmmaModule
    systemMap: CmmaSystem
  }) {
    const { moduleLabel, module, systemMap } = addModuleToSystemOptions

    Object.assign(systemMap.modules, {
      [moduleLabel]: module,
    })
  }

  /**
   * @description Get a Module's index by Label
   * @author ƒa†3
   * @param {} getModuleIndexByLabelOptions
   */
  public static getModuleIndexByLabel(getModuleIndexByLabelOptions: {
    systemMap: CmmaSystem
    moduleLabel: string
  }) {
    const { systemMap, moduleLabel } = getModuleIndexByLabelOptions

    return this.listModulesInSystem(systemMap).indexOf(moduleLabel)
  }

  /**
   * @description List Modules in a System
   * @author ƒa†3
   * @param {CmmaSystem} system
   */
  public static listModulesInSystem(system: CmmaSystem) {
    return Object.keys(system.modules)
  }

  /**
   * @description List System Artifacts Label
   * @author ƒa†3
   * @param {} system
   */
  public static listSystemArtifactGroups(system: CmmaSystem) {
    return Object.keys(system.systemArtifacts)
  }

  /**
   * @description List Systemm Abstract Artifacts Label
   * @author ƒa†3
   * @param {} system
   */
  public static listSystemAbstractArtifactGroups(system: CmmaSystem) {
    return Object.keys(system.abstractArtifacts)
  }

  /**
   * @description E.g List Models, List Controllers
   * @author ƒa†3
   * @param {} listSystemArtifactsByGroupLabelOptions
   */
  public static listSystemArtifactsByGroupLabel(listSystemArtifactsByGroupLabelOptions: {
    artifactsDir: CmmaArtifactDirs
    systemMap: CmmaSystem
  }): CmmaArtifactsGroup {
    const { systemMap, artifactsDir } = listSystemArtifactsByGroupLabelOptions

    return systemMap.systemArtifacts[artifactsDir]
  }

  /**
   * @description
   * @author ƒa†3
   * @param {} listSystemAbstractArtifactsByGroupLabelOptions
   */
  public static listSystemAbstractArtifactsByGroupLabel(listSystemAbstractArtifactsByGroupLabelOptions: {
    abstractArtifactGroupLabel: CmmaAbstractArtifactEnum
    systemMap: CmmaSystem
  }) {
    const { systemMap, abstractArtifactGroupLabel } = listSystemAbstractArtifactsByGroupLabelOptions

    return systemMap.abstractArtifacts[abstractArtifactGroupLabel]
  }

  /**
   * @description Add an Artifact to System Artifact Group
   * @author ƒa†3
   * @param {} addArtifactToArtifactGroupOptions
   */
  public static addArtifactToArtifactGroup(addArtifactToArtifactGroupOptions: {
    artifact: CmmaArtifact
    artifactsDir: CmmaArtifactDirs
    systemMap: CmmaSystem
  }) {
    const { artifact, artifactsDir, systemMap } = addArtifactToArtifactGroupOptions

    const artifactGroup = this.listSystemArtifactsByGroupLabel({
      artifactsDir,
      systemMap,
    })

    artifactGroup.push(artifact)
  }

  /**
   * @description Add an abstract artifact to Project
   * @author ƒa†3
   * @param {} addAbstractArtifactToAbstractArtifactGroupOptions
   */
  public static addAbstractArtifactToAbstractArtifactGroup(addAbstractArtifactToAbstractArtifactGroupOptions: {
    abstractArtifact: string
    abstractArtifactGroupLabel: CmmaAbstractArtifactEnum
    systemMap: CmmaSystem
  }) {
    const { abstractArtifact, abstractArtifactGroupLabel, systemMap } =
      addAbstractArtifactToAbstractArtifactGroupOptions

    const abstractArtifactGroup = this.listSystemAbstractArtifactsByGroupLabel({
      abstractArtifactGroupLabel,
      systemMap,
    })

    abstractArtifactGroup.push(abstractArtifact)
  }

  /**
   * @description Get an Artifact Object from System Artifact Group
   * @author ƒa†3
   * @param {} getArtifactObjectFromArtifactGroupOptions
   */
  public static getArtifactObjectFromArtifactGroupByLabel(getArtifactObjectFromArtifactGroupOptions: {
    artifactLabel: string
    artifactGroupLabel: CmmaArtifactDirs
    system: CmmaSystem
  }): CmmaArtifact {
    const { artifactLabel, artifactGroupLabel, system } = getArtifactObjectFromArtifactGroupOptions

    const artifactGroup = this.listSystemArtifactsByGroupLabel({
      artifactsDir: artifactGroupLabel,
      systemMap: system,
    })

    const buffer = artifactGroup.filter((artifact) => artifact === artifactLabel)

    return buffer[0]
  }

  /**
   * @description Get abstract Artifact from Abstract Artifact Group By Label
   * @author ƒa†3
   * @param {} getAbstractArtifactFromAbstractArtifactGroupByLabelOptions
   */
  public static getAbstractArtifactFromAbstractArtifactGroupByLabel(getAbstractArtifactFromAbstractArtifactGroupByLabelOptions: {
    abstractArtifact: string
    abstractArtifactGroupLabel: CmmaAbstractArtifactEnum
    systemMap: CmmaSystem
  }) {
    const { abstractArtifact, abstractArtifactGroupLabel, systemMap } =
      getAbstractArtifactFromAbstractArtifactGroupByLabelOptions

    const abstractArtifactsGroup = this.listSystemAbstractArtifactsByGroupLabel({
      abstractArtifactGroupLabel,
      systemMap,
    })

    return abstractArtifactsGroup[abstractArtifactsGroup.indexOf(abstractArtifact)]
  }

  /**
   * @description Get an Artifact Object from Artifact Group by Index
   * @author ƒa†3
   * @param {} getArtifactObjectFromArtifactGroupByIndexOptions
   */
  public static getArtifactObjectFromArtifactGroupByIndex(getArtifactObjectFromArtifactGroupByIndexOptions: {
    artifactIndex: number
    artifactGroupLabel: CmmaArtifactDirs
    system: CmmaSystem
  }): CmmaArtifact {
    const { artifactIndex, artifactGroupLabel, system } =
      getArtifactObjectFromArtifactGroupByIndexOptions

    const artifactGroup = this.listSystemArtifactsByGroupLabel({
      artifactsDir: artifactGroupLabel,
      systemMap: system,
    })

    return artifactGroup[artifactIndex]
  }

  /**
   * @description Get abstract Artifact from Abstract Artifact Group By Index
   * @author ƒa†3
   * @param {} getAbstractArtifactFromAbstractArtifactGroupByLabelOptions
   */
  public static getAbstractArtifactFromAbstractArtifactGroupByIndex(getAbstractArtifactFromAbstractArtifactGroupByLabelOptions: {
    abstractArtifactIndex: number
    abstractArtifactGroupLabel: CmmaAbstractArtifactEnum
    systemMap: CmmaSystem
  }) {
    const { abstractArtifactIndex, abstractArtifactGroupLabel, systemMap } =
      getAbstractArtifactFromAbstractArtifactGroupByLabelOptions

    const abstractArtifactsGroup = this.listSystemAbstractArtifactsByGroupLabel({
      abstractArtifactGroupLabel,
      systemMap,
    })

    return abstractArtifactsGroup[abstractArtifactIndex]
  }

  /**
   * @description Delete an Artifact Object from System Artifact Group
   * @author ƒa†3
   * @param {} deleteArtifactObjectFromArtifactGroupOptions
   */
  public static deleteArtifactObjectFromArtifactGroupByLabel(deleteArtifactObjectFromArtifactGroupOptions: {
    artifactLabel: string
    artifactDir: CmmaArtifactDirs
    systemMap: CmmaSystem
  }) {
    const { artifactLabel, artifactDir, systemMap } = deleteArtifactObjectFromArtifactGroupOptions

    const artifactGroup = this.listSystemArtifactsByGroupLabel({
      artifactsDir: artifactDir,
      systemMap: systemMap,
    })

    const artifactIndex = artifactGroup.indexOf(artifactLabel)

    artifactGroup.splice(artifactIndex, 1)
  }

  /**
   * @description Delete an Abstract Artifact from System Abstract Artifact Group By Label
   * @author ƒa†3
   * @param {} deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions
   */
  public static deleteAbstractArtifactFromAbstractArtifactGroupByLabel(deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions: {
    abstractArtifactLabel: string
    abstractArtifactGroupLabel: CmmaAbstractArtifactEnum
    systemMap: CmmaSystem
  }) {
    const { abstractArtifactLabel, abstractArtifactGroupLabel, systemMap } =
      deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions

    const abstractArtifactGroup = this.listSystemAbstractArtifactsByGroupLabel({
      abstractArtifactGroupLabel,
      systemMap,
    })

    const artifactIndex = abstractArtifactGroup.indexOf(abstractArtifactLabel)

    abstractArtifactGroup.splice(artifactIndex, 1)
  }

  /**
   * @description Delete an Artifact Object from Artifact Group by Index
   * @author ƒa†3
   * @param {} deleteArtifactObjectFromArtifactGroupByIndexOptions
   */
  public static deleteArtifactObjectFromArtifactGroupByIndex(deleteArtifactObjectFromArtifactGroupByIndexOptions: {
    artifactIndex: number
    artifactGroupLabel: CmmaArtifactDirs
    system: CmmaSystem
  }) {
    const { artifactIndex, artifactGroupLabel, system } =
      deleteArtifactObjectFromArtifactGroupByIndexOptions

    const artifactGroup = this.listSystemArtifactsByGroupLabel({
      artifactsDir: artifactGroupLabel,
      systemMap: system,
    })

    artifactGroup.splice(artifactIndex, 1)
  }

  /**
   * @description Delete an Abstract Artifact from System Abstract Artifact Group By Index
   * @author ƒa†3
   * @param {} deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions
   */
  public static deleteAbstractArtifactFromAbstractArtifactGroupByIndex(deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions: {
    abstractArtifactIndex: number
    abstractArtifactGroupLabel: CmmaAbstractArtifactEnum
    systemMap: CmmaSystem
  }) {
    const { abstractArtifactIndex, abstractArtifactGroupLabel, systemMap } =
      deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions

    const abstractArtifactGroup = this.listSystemAbstractArtifactsByGroupLabel({
      abstractArtifactGroupLabel,
      systemMap,
    })

    abstractArtifactGroup.splice(abstractArtifactIndex, 1)
  }

  /**
   * @description Get A Module By Label
   * @author ƒa†3
   * @param {} getModuleByLabelOptions
   */
  public static getModuleMapByLabel(getModuleByLabelOptions: {
    moduleLabel: string
    systemMap: CmmaSystem
  }) {
    const { moduleLabel, systemMap } = getModuleByLabelOptions

    return systemMap.modules[moduleLabel]
  }

  /**
   * @description Get A System Artifact By Label
   * @author ƒa†3
   * @param {} getSystemArtifactByLabelOptions
   */
  public static getSystemArtifactByLabel(getSystemArtifactByLabelOptions: {
    systemArtifactLabel: string
    system: CmmaSystem
  }) {
    const { system, systemArtifactLabel } = getSystemArtifactByLabelOptions

    return system.systemArtifacts[systemArtifactLabel]
  }

  /**
   * @description Get a Module By Index
   * @author ƒa†3
   * @param {} getModuleByIndexOptions
   */
  public static getModuleByIndex(getModuleByIndexOptions: {
    moduleIndex: number
    system: CmmaSystem
  }) {
    const { moduleIndex, system } = getModuleByIndexOptions

    const moduleLabels = this.listModulesInSystem(system)

    return this.getModuleMapByLabel({
      moduleLabel: moduleLabels[moduleIndex],
      systemMap: system,
    })
  }

  /**
   * @description Get System Artifact By Index
   * @author ƒa†3
   * @param {} getSystemArtifactByIndexOptions
   */
  public static getSystemArtifactByIndex(getSystemArtifactByIndexOptions: {
    systemArtifactIndex: number
    systemArtifactLabel: string
    system: CmmaSystem
  }) {
    const { system, systemArtifactIndex, systemArtifactLabel } = getSystemArtifactByIndexOptions

    const systemArtifactLabels = this.getSystemArtifactByLabel({
      systemArtifactLabel,
      system,
    })

    return this.getSystemArtifactByLabel({
      systemArtifactLabel: systemArtifactLabels[systemArtifactIndex],
      system,
    })
  }

  /**
   * @description Delete Module By Label
   * @author ƒa†3
   * @param {} deleteModuleByLabelOptions
   */
  public static deleteModuleByLabel(deleteModuleByLabelOptions: {
    moduleLabel: string
    systemMap: CmmaSystem
  }) {
    const { moduleLabel, systemMap } = deleteModuleByLabelOptions

    delete systemMap.modules[moduleLabel]
  }

  /**
   * @description Delete System Artifact By Label
   * @author ƒa†3
   * @param {} deleteSystemArtifactByLabelOptions
   */
  public static deleteSystemArtifactByLabel(deleteSystemArtifactByLabelOptions: {
    systemArtifactLabel: CmmaArtifactDirs
    system: CmmaSystem
  }) {
    const { systemArtifactLabel, system } = deleteSystemArtifactByLabelOptions

    delete system.systemArtifacts[systemArtifactLabel]
  }

  /**
   * @description Delete Module By Index
   * @author ƒa†3
   * @param {} deleteModuleByIndexOptions
   */
  public static deleteModuleByIndex(deleteModuleByIndexOptions: {
    moduleIndex: number
    system: CmmaSystem
  }) {
    const { moduleIndex, system } = deleteModuleByIndexOptions

    const moduleLabels = Object.keys(system.modules)

    return this.deleteModuleByLabel({
      moduleLabel: moduleLabels[moduleIndex],
      systemMap: system,
    })
  }

  /**
   * @description Check if Module Is In System
   * @author ƒa†3
   * @param {} isModuleInSystemOptions
   */
  public static isModuleInSystem(isModuleInSystemOptions: {
    moduleLabel: string
    systemMap: CmmaSystem
  }) {
    const { moduleLabel, systemMap } = isModuleInSystemOptions

    return this.listModulesInSystem(systemMap).includes(moduleLabel)
  }

  /**
   * @description Check if System Artifact is in System
   * @author ƒa†3
   * @param isSystemArtifactInSystemOptions
   */
  public static isArtifactInSystemArtifactGroup(isSystemArtifactInSystemOptions: {
    artifactLabel: string
    artifactsDir: CmmaArtifactDirs
    systemMap: CmmaSystem
  }) {
    const { systemMap, artifactLabel, artifactsDir } = isSystemArtifactInSystemOptions

    return this.listSystemArtifactsByGroupLabel({
      artifactsDir: artifactsDir,
      systemMap,
    }).includes(artifactLabel)
  }

  public static isAbstractArtifactInArtifactGroup(isAbstractArtifactInArtifactGroupOptions: {
    abstractArtifactLabel: string
    abstractArtifactGroupLabel: CmmaAbstractArtifactEnum
    systemMap: CmmaSystem
  }) {
    const { abstractArtifactLabel, abstractArtifactGroupLabel, systemMap } =
      isAbstractArtifactInArtifactGroupOptions

    return this.listSystemAbstractArtifactsByGroupLabel({
      abstractArtifactGroupLabel,
      systemMap,
    }).includes(abstractArtifactLabel)
  }

  /**
   * @description List Appwrite Seeders in System
   * @author ƒa†3
   * @param {} listSystemAppwriteSeedersOptions
   */
  public static listSystemAppwriteSeeders(listSystemAppwriteSeedersOptions: {
    systemMap: CmmaSystem
    configObject: CmmaConfiguration
  }) {
    const { systemMap, configObject } = listSystemAppwriteSeedersOptions
    const seeders = this.listSystemArtifactsByGroupLabel({
      systemMap,
      artifactsDir: 'seeders',
    })
    // NOTE ->. Probably want to transfrom this
    const appwriteLabel = CmmaConfigurationActions.normalizeProjectIdentifier({
      identifier: 'Appwrite',
      configObject,
    })
    return seeders.filter((seeder) => seeder.includes(appwriteLabel))
  }

  /**
   * @description Method to get a blank System Map
   * @author ƒa†3
   * @returns {CmmaSystem}
   */
  public static get blankSystemMap(): CmmaSystem {
    return {
      systemArtifacts: {
        actions: [],
        helpers: [],
        migrations: [],
        models: [],
        routes: [],
        seeders: [],
        views: [],
        typeChecking: [],
      },
      abstractArtifacts: {},
      modules: {},
      systemLabel: '',
    }
  }
}
