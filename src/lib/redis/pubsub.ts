/* ─────────────────────────────────────────────────────
 * Redis — Pub/Sub Broker
 * Real-time events for chat, notifications, and meetings
 * ───────────────────────────────────────────────────── */

import Redis from 'ioredis';

let publisher: Redis | null = null;
let subscriber: Redis | null = null;

function getPublisher(): Redis {
  if (!publisher) {
    publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return publisher;
}

function getSubscriber(): Redis {
  if (!subscriber) {
    subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // Subscriber should not timeout
      lazyConnect: true,
    });
  }
  return subscriber;
}

// ── Channel Patterns ──

export const PubSubChannels = {
  /** Direct chat messages between two users in a conversation */
  chat: (conversationId: string) => `pubsub:chat:${conversationId}`,
  /** All events for a specific user (notifications, alerts, status) */
  userEvents: (userId: string) => `pubsub:user:${userId}`,
  /** Collaboration room events */
  room: (roomSlug: string) => `pubsub:room:${roomSlug}`,
  /** Global platform events (admin broadcasts) */
  global: () => 'pubsub:global',
} as const;

// ── Event Types ──

export interface PubSubEvent {
  type:
    | 'new_message'
    | 'message_read'
    | 'connection_request'
    | 'connection_accepted'
    | 'connection_rejected'
    | 'notification'
    | 'room_invite'
    | 'presence_update'
    | 'work_published'
    | 'typing_indicator';
  payload: Record<string, unknown>;
  timestamp: string;
  senderId?: string;
}

// ── Publish ──

/** Publish an event to a channel */
export async function publishEvent(
  channel: string,
  event: PubSubEvent
): Promise<void> {
  const pub = getPublisher();
  try {
    await pub.publish(channel, JSON.stringify(event));
  } catch (err) {
    console.error('[PubSub] Publish error:', err);
  }
}

// ── Subscribe ──

type EventHandler = (event: PubSubEvent) => void;

/** Subscribe to a channel and handle incoming events */
export async function subscribeToChannel(
  channel: string,
  handler: EventHandler
): Promise<() => void> {
  const sub = getSubscriber();

  const messageHandler = (ch: string, message: string) => {
    if (ch === channel) {
      try {
        const event = JSON.parse(message) as PubSubEvent;
        handler(event);
      } catch (err) {
        console.error('[PubSub] Parse error:', err);
      }
    }
  };

  sub.on('message', messageHandler);
  await sub.subscribe(channel);

  // Return an unsubscribe function
  return async () => {
    sub.off('message', messageHandler);
    await sub.unsubscribe(channel);
  };
}

// ── Convenience Publishers ──

/** Publish a new chat message event */
export async function publishChatMessage(
  conversationId: string,
  message: { id: string; senderId: string; content: string }
): Promise<void> {
  await publishEvent(PubSubChannels.chat(conversationId), {
    type: 'new_message',
    payload: message,
    timestamp: new Date().toISOString(),
    senderId: message.senderId,
  });
}

/** Publish a notification to a specific user */
export async function publishNotification(
  userId: string,
  notification: { title: string; body: string; link?: string; type: string }
): Promise<void> {
  await publishEvent(PubSubChannels.userEvents(userId), {
    type: 'notification',
    payload: notification,
    timestamp: new Date().toISOString(),
  });
}

/** Publish a connection request event */
export async function publishConnectionEvent(
  receiverId: string,
  senderId: string,
  senderName: string,
  eventType: 'connection_request' | 'connection_accepted' | 'connection_rejected'
): Promise<void> {
  await publishEvent(PubSubChannels.userEvents(receiverId), {
    type: eventType,
    payload: { senderId, senderName },
    timestamp: new Date().toISOString(),
    senderId,
  });
}

/** Cleanup pub/sub connections */
export async function closePubSub(): Promise<void> {
  if (publisher) {
    await publisher.quit();
    publisher = null;
  }
  if (subscriber) {
    await subscriber.quit();
    subscriber = null;
  }
}
