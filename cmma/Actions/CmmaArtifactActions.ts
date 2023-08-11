import CmmaArtifact from '../Models/CmmaArtifact'

export default class CmmaArtifactActions {
  /**
   * @description Method to get a blank artifact map
   * @author ƒa†3
   * @returns {CmmaArtifact}
   *
   */
  public static get blankArtifact(): CmmaArtifact {
    return ''
  }

  /**
   * @description What is node path from Project Map
   * @author ƒa†3
   * @param {} whatIsNodeMapFromMeOptions
   */
  public static whatIsNodePathFromMe(whatIsNodeMapFromMeOptions: { artifactLabel?: string }) {
    const { artifactLabel } = whatIsNodeMapFromMeOptions

    const nodeMap: Array<string> = []

    if (artifactLabel) {
      nodeMap.push(artifactLabel)
    }

    return nodeMap
  }
}
