import ApkReader from 'adbkit-apkreader'
import Debug from 'debug'
import { extname, resolve } from 'path'

const debug = Debug('apkup:helpers')

export interface IPackageManifest {
  /** ID of the package */
  packageName: string
  /** Version code of the package */
  versionCode: number
}

/**
 * Parse the manifest of an APK file
 * @param apk Path to the APK file
 */
export const parseManifest = async (
  apk: string | string[]
): Promise<IPackageManifest> => {
  debug('> Parsing manifest')
  const apkFile = resolve(typeof apk !== 'string' ? apk[0] : apk)

  let manifest: IPackageManifest

  debug(`> File path ${apkFile}`)
  const ext = extname(apkFile)
  if (ext === '.apk') {
    const reader = await ApkReader.open(apkFile)
    const manifestResponse = await reader.readManifest()

    manifest = {
      packageName: manifestResponse.package,
      versionCode: manifestResponse.versionCode
    }
  } else {
    throw new Error('The file must be an APK.')
  }

  debug(`> Detected package name ${manifest.packageName}`)
  debug(`> Detected version code ${manifest.versionCode}`)

  return manifest
}

/**
 * Available tracks
 */
export const tracks: string[] = [
  'internal',
  'alpha',
  'beta',
  'production',
  'rollout'
]

/**
 * Check if a track is valid
 * @param track Name of the track to check
 *
 * @returns Does the track exits?
 */
export const checkTrack = (track: string): boolean => {
  return tracks.includes(track)
}
