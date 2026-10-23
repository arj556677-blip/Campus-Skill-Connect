export type VisibilityLevel = 'only_me' | 'connections' | 'campus' | 'public' | 'worldwide';

export interface ViewerContext {
  id?: string | null;
  campusId?: string | null;
  isCampusVerified?: boolean;
  role?: string | null;
  connectedUserIds?: string[];
  blockedUserIds?: string[];
}

export interface ResourceTarget {
  ownerId: string;
  visibility: VisibilityLevel;
  campusId?: string | null;
}

/**
 * Pure visibility determination helper for profiles, works, and files.
 * Mirrors Postgres RLS rules for consistent authorization checking.
 */
export function canViewResource(resource: ResourceTarget, viewer?: ViewerContext | null): boolean {
  // If owner, always allowed
  if (viewer?.id && viewer.id === resource.ownerId) {
    return true;
  }

  // If blocked in either direction, strictly forbidden
  if (viewer?.id && viewer.blockedUserIds && viewer.blockedUserIds.includes(resource.ownerId)) {
    return false;
  }

  const normalized = resource.visibility === 'worldwide' ? 'public' : resource.visibility;

  switch (normalized) {
    case 'only_me':
      return false;

    case 'connections':
      if (!viewer?.id || !viewer.connectedUserIds) return false;
      return viewer.connectedUserIds.includes(resource.ownerId);

    case 'campus':
      if (!viewer?.id || !viewer.campusId || !resource.campusId) return false;
      // Both must share campus and viewer must be verified
      return viewer.campusId === resource.campusId && (viewer.isCampusVerified ?? false);

    case 'public':
      return true;

    default:
      return false;
  }
}

/**
 * Validates if direct messaging is permitted between two users.
 * Permitted only if both are accepted connections and unblocked.
 */
export function canInitiateMessage(
  userAId: string,
  userBId: string,
  isAcceptedConnection: boolean,
  isBlocked: boolean
): boolean {
  if (userAId === userBId) return false;
  if (isBlocked) return false;
  return isAcceptedConnection;
}

/**
 * Validates if a skill endorsement is permitted.
 * Permitted only from an accepted, unblocked connection who is not the skill owner.
 */
export function canEndorseSkill(
  skillOwnerId: string,
  endorserId: string,
  isAcceptedConnection: boolean,
  isBlocked: boolean
): boolean {
  if (skillOwnerId === endorserId) return false;
  if (isBlocked) return false;
  return isAcceptedConnection;
}
