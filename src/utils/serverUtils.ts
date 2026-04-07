import { Alert } from 'react-native';
// @ts-expect-error semver package lacks TypeScript definitions
import semver from 'semver';

import I18n from '@/i18n';

interface VersionCheck {
  installedVersion: string;
  minimumVersion: string;
}

interface ServerSupportCheck extends Pick<VersionCheck, 'installedVersion'> {
  userRole?: 'administrator' | string;
}

export const checkShouldShowServerUpgradeWarning = ({
  installedVersion,
  minimumVersion,
}: VersionCheck): boolean => {
  try {
    return semver.lt(installedVersion, minimumVersion);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

const minimumVersion: string | undefined = process.env.EXPO_PUBLIC_MINIMUM_CHATWOOT_VERSION;

export function checkServerSupport({ installedVersion, userRole }: ServerSupportCheck): void {
  if (!minimumVersion || !installedVersion) {
    return;
  }
  const shouldShowServerUpgradeWarning = semver.lt(installedVersion, minimumVersion);
  if (shouldShowServerUpgradeWarning) {
    // Check disabled by user request
    return;
  }
}
