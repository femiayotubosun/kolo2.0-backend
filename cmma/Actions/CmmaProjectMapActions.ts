import CmmaContext from '../Models/CmmaContext'
import CmmaProjectMap from '../Models/CmmaProjectMap'
import CmmaArtifact from '../Models/CmmaArtifact'

export default class CmmaProjectMapActions {
  /**
   * @description Add a Context to Project
   * @author ƒa†3
   * @param addContextToProjectOptions
   */
  public static addContextToProject(addContextToProjectOptions: {
    contextLabel: string
    context: CmmaContext
    projectMap: CmmaProjectMap
  }) {
    const { contextLabel, context, projectMap } = addContextToProjectOptions

    Object.assign(projectMap.contexts, {
      [contextLabel]: context,
    })
  }

  /**
   * @description Get a Context's Index By Label
   * @author ƒa†3
   * @param {} getContextIndexByLabelOptions
   */
  public static getContextIndexByLabel(getContextIndexByLabelOptions: {
    contextLabel: string
    projectMap: CmmaProjectMap
  }) {
    const { contextLabel, projectMap } = getContextIndexByLabelOptions

    return this.listContextsInProject(projectMap).indexOf(contextLabel)
  }

  /**
   * @description Get Context By Index
   * @param getContextObjectByIndexOptions
   * @author ƒa†3
   */
  public static getContextByIndex(getContextObjectByIndexOptions: {
    contextIndex: number
    projectMap: CmmaProjectMap
  }): CmmaContext {
    const { contextIndex, projectMap } = getContextObjectByIndexOptions
    const contextLabels = Object.keys(projectMap.contexts)

    return projectMap.contexts[contextLabels[contextIndex]]
  }

  /**
   * @description Get a context by Label
   * @author ƒa†3
   * @param getContextFromProjectMapOptions
   */
  public static getContextMapByLabel(getContextFromProjectMapOptions: {
    projectMap: CmmaProjectMap
    contextLabel: string
  }) {
    const { projectMap, contextLabel } = getContextFromProjectMapOptions

    return projectMap.contexts[contextLabel]
  }

  /**
   * @description List Contexts In Project
   * @author ƒa†3
   * @param {CmmaProjectMap} projectMap
   */
  public static listContextsInProject(projectMap: CmmaProjectMap) {
    return Object.keys(projectMap.contexts)
  }

  /**
   * @description Delete Context By Index
   * @author ƒa†3
   * @param {} deleteContextByIndexOptions
   */
  public static deleteContextByIndex(deleteContextByIndexOptions: {
    contextIndex: number
    projectMap: CmmaProjectMap
  }) {
    const { contextIndex, projectMap } = deleteContextByIndexOptions
    const contextLabels = Object.keys(projectMap.contexts)

    const contextLabel = contextLabels[contextIndex]

    delete projectMap.contexts[contextLabel]
  }

  /**
   * @description Delete Context By Label
   * @author ƒa†3
   * @param {} deleteContextByLabelOptions
   */
  public static deleteContextByLabel(deleteContextByLabelOptions: {
    contextLabel: string
    projectMap: CmmaProjectMap
  }) {
    const { projectMap, contextLabel } = deleteContextByLabelOptions

    delete projectMap.contexts[contextLabel]
  }

  /**
   * @description Check if Context is in Project
   * @author ƒa†3
   * @param {} isContextInProjectOptions
   */
  public static isContextInProject(isContextInProjectOptions: {
    contextLabel: string
    projectMap: CmmaProjectMap
  }) {
    const { contextLabel, projectMap } = isContextInProjectOptions

    return this.listContextsInProject(projectMap).includes(contextLabel)
  }

  public static addArtifactToProject(addArtifactToProjectOptions: {
    artifact: CmmaArtifact
    projectMap: CmmaProjectMap
  }) {
    const { artifact, projectMap } = addArtifactToProjectOptions

    projectMap.artifacts.push(artifact)
  }

  /**
   * @description Get Blank Project Map
   * @author ƒa†3
   */
  public static get blankProjectMap(): CmmaProjectMap {
    return {
      contexts: {},
      artifacts: [],
    }
  }
}
