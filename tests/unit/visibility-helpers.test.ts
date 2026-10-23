import { describe, it, expect } from 'vitest';
import { canViewResource, canInitiateMessage, canEndorseSkill } from '@/lib/utils/visibility';

describe('Visibility & Authorization Helpers', () => {
  const ownerId = 'user-owner-123';
  const peerId = 'user-peer-456';
  const strangerId = 'user-stranger-789';
  const campusId = 'campus-powai-999';

  describe('canViewResource', () => {
    it('always permits owner regardless of visibility', () => {
      const viewer = { id: ownerId };
      expect(canViewResource({ ownerId, visibility: 'only_me' }, viewer)).toBe(true);
      expect(canViewResource({ ownerId, visibility: 'connections' }, viewer)).toBe(true);
      expect(canViewResource({ ownerId, visibility: 'campus' }, viewer)).toBe(true);
      expect(canViewResource({ ownerId, visibility: 'public' }, viewer)).toBe(true);
    });

    it('denies access if viewer is blocked by owner', () => {
      const viewer = { id: peerId, blockedUserIds: [ownerId] };
      expect(canViewResource({ ownerId, visibility: 'public' }, viewer)).toBe(false);
    });

    it('strictly denies only_me resources to non-owners', () => {
      const viewer = { id: peerId, connectedUserIds: [ownerId] };
      expect(canViewResource({ ownerId, visibility: 'only_me' }, viewer)).toBe(false);
    });

    it('enforces connections-only to accepted connections', () => {
      const connectedViewer = { id: peerId, connectedUserIds: [ownerId] };
      const strangerViewer = { id: strangerId, connectedUserIds: [] };

      expect(canViewResource({ ownerId, visibility: 'connections' }, connectedViewer)).toBe(true);
      expect(canViewResource({ ownerId, visibility: 'connections' }, strangerViewer)).toBe(false);
    });

    it('enforces campus visibility to verified campus peers only', () => {
      const verifiedCampusPeer = { id: peerId, campusId, isCampusVerified: true };
      const unverifiedCampusPeer = { id: peerId, campusId, isCampusVerified: false };
      const differentCampusPeer = { id: peerId, campusId: 'other-campus', isCampusVerified: true };

      expect(canViewResource({ ownerId, visibility: 'campus', campusId }, verifiedCampusPeer)).toBe(true);
      expect(canViewResource({ ownerId, visibility: 'campus', campusId }, unverifiedCampusPeer)).toBe(false);
      expect(canViewResource({ ownerId, visibility: 'campus', campusId }, differentCampusPeer)).toBe(false);
    });

    it('permits public and worldwide items to any viewer', () => {
      expect(canViewResource({ ownerId, visibility: 'public' }, null)).toBe(true);
      expect(canViewResource({ ownerId, visibility: 'worldwide' }, null)).toBe(true);
    });
  });

  describe('canInitiateMessage', () => {
    it('allows messaging only between accepted, unblocked connections', () => {
      expect(canInitiateMessage(ownerId, peerId, true, false)).toBe(true);
      expect(canInitiateMessage(ownerId, peerId, false, false)).toBe(false);
      expect(canInitiateMessage(ownerId, peerId, true, true)).toBe(false);
      expect(canInitiateMessage(ownerId, ownerId, true, false)).toBe(false); // No self-messaging
    });
  });

  describe('canEndorseSkill', () => {
    it('allows endorsement only from accepted unblocked connection and never self', () => {
      expect(canEndorseSkill(ownerId, peerId, true, false)).toBe(true);
      expect(canEndorseSkill(ownerId, ownerId, true, false)).toBe(false);
      expect(canEndorseSkill(ownerId, peerId, false, false)).toBe(false);
      expect(canEndorseSkill(ownerId, peerId, true, true)).toBe(false);
    });
  });
});
