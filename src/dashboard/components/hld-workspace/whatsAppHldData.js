/**
 * WhatsApp High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (Online Real-Time Delivery, Offline Spool & Push, Delivery & Read Receipt Sync)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const WHATSAPP_HLD_DATA = {
  lessonId: 'whatsapp',
  title: 'Distributed Real-Time Messaging & Presence Architecture (WhatsApp)',
  systemName: 'End-to-End Encrypted, Low-Latency Real-Time Messaging Engine with Offline Buffering',
  scaleMetrics: {
    monthlyCreates: '100 Billion messages sent/day',
    avgWriteRps: '~1,150,000 messages/sec',
    peakWriteRps: '~3,000,000 messages/sec',
    monthlyRedirects: '3 Trillion messages delivered/mo',
    avgReadRps: '~2,000,000 receipt events/sec',
    peakReadRps: '~5,000,000 receipt events/sec',
    targetRedirectLatency: '< 100 ms P99 Online Delivery / < 20 ms ACK',
    storagePerYear: 'Ephemeral transit storage + ~15 PB encrypted media / year'
  },

  scaleMetricsList: [
    { label: 'Daily Message Volume', value: '100 Billion msg / day', color: 'blue' },
    { label: 'Peak Ingestion QPS', value: '3,000,000 req / sec', color: 'emerald' },
    { label: 'Concurrent Connections', value: '100 Million WebSockets', color: 'indigo' },
    { label: 'Online Delivery SLA', value: '< 100ms P99 End-to-End', color: 'cyan' },
    { label: 'Privacy & Security', value: 'Signal Protocol E2EE', color: 'amber' }
  ],

  // Tier boundaries for the SVG Canvas (viewBox 0 0 1100 680)
  tierBoxes: [
    { x: 210, y: 30, w: 380, h: 390, textX: 225, textY: 55, title: 'PERSISTENT CONNECTION & INGRESS FLEET (WEBSOCKET / ERLANG)', color: 'indigo' },
    { x: 605, y: 30, w: 440, h: 400, textX: 620, textY: 55, title: 'SESSION REGISTRY, ROUTING & OFFLINE QUEUE BUFFERS', color: 'blue' },
    { x: 210, y: 440, w: 835, h: 225, textX: 225, textY: 465, title: 'PERSISTENCE, MEDIA STORAGE (S3) & PUSH NOTIFICATIONS (APNS/FCM)', color: 'amber' }
  ],

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'Mobile & Desktop Client Tier', color: 'slate' },
    { id: 'gateway-tier', name: 'Persistent Connection & Ingress Tier', color: 'indigo' },
    { id: 'routing-tier', name: 'Routing, Session & Queue Tier', color: 'emerald' },
    { id: 'persistence-tier', name: 'Storage, Media & Push Notification Tier', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas (viewBox 0 0 1100 680)
  nodes: [
    {
      id: 'sender-device',
      label: 'Sender Client Device',
      sublabel: 'iOS • Android • Double Ratchet E2EE',
      tier: 'client-tier',
      tierLabel: 'Sender Device',
      category: 'Client Tier',
      icon: 'smartphone',
      x: 40,
      y: 190,
      width: 150,
      height: 90,
      badge: 'Signal Protocol E2EE',
      color: 'slate'
    },
    {
      id: 'l4-lb',
      label: 'L4 Anycast Load Balancer',
      sublabel: 'TCP / TLS 5-Tuple Connection Director',
      tier: 'gateway-tier',
      tierLabel: 'L4 Ingress',
      category: 'Edge & Ingress',
      icon: 'alt_route',
      x: 230,
      y: 190,
      width: 155,
      height: 85,
      badge: 'L4 Pass-Through',
      color: 'indigo'
    },
    {
      id: 'conn-gateway-a',
      label: 'Connection Gateway A',
      sublabel: 'Epoll/kqueue WebSocket Server (Sender)',
      tier: 'gateway-tier',
      tierLabel: 'Gateway Pod',
      category: 'Connection Fleet',
      icon: 'electrical_services',
      x: 230,
      y: 55,
      width: 155,
      height: 85,
      badge: '1M Sockets / Box',
      color: 'cyan'
    },
    {
      id: 'message-service',
      label: 'Message Routing Service',
      sublabel: 'Deduplication • Sequence Generator',
      tier: 'routing-tier',
      tierLabel: 'Core Engine',
      category: 'Stateless Compute',
      icon: 'chat',
      x: 415,
      y: 55,
      width: 165,
      height: 85,
      badge: 'Per-Chat Ordering',
      color: 'blue'
    },
    {
      id: 'session-registry',
      label: 'Session & Presence Registry',
      sublabel: 'Redis Cluster (userId &rarr; Gateway IP)',
      tier: 'routing-tier',
      tierLabel: 'Presence Store',
      category: 'In-Memory Store',
      icon: 'badge',
      x: 415,
      y: 190,
      width: 165,
      height: 85,
      badge: 'Active Socket Locator',
      color: 'emerald'
    },
    {
      id: 'conn-gateway-b',
      label: 'Connection Gateway B',
      sublabel: 'Recipient Active WebSocket Handler',
      tier: 'gateway-tier',
      tierLabel: 'Gateway Pod',
      category: 'Connection Fleet',
      icon: 'electrical_services',
      x: 415,
      y: 305,
      width: 165,
      height: 80,
      badge: 'Recipient Socket',
      color: 'cyan'
    },
    {
      id: 'recipient-device',
      label: 'Recipient Client Device',
      sublabel: 'Double Ratchet Decrypt • Emits ACKs',
      tier: 'client-tier',
      tierLabel: 'Recipient Device',
      category: 'Client Tier',
      icon: 'mark_chat_read',
      x: 620,
      y: 65,
      width: 180,
      height: 85,
      badge: 'Online Receiver',
      color: 'emerald'
    },
    {
      id: 'offline-message-store',
      label: 'Offline Message Spool (Cassandra)',
      sublabel: '30-Day TTL Encrypted Message Spool',
      tier: 'routing-tier',
      tierLabel: 'Offline Spool',
      category: 'Persistence Tier',
      icon: 'move_to_inbox',
      x: 620,
      y: 190,
      width: 180,
      height: 85,
      badge: 'Durable Offline Spool',
      color: 'amber'
    },
    {
      id: 'push-service',
      label: 'Push Notification Gateway',
      sublabel: 'Apple APNs • Google FCM (Wakeup)',
      tier: 'persistence-tier',
      tierLabel: 'Push Nudge',
      category: 'Notification Engine',
      icon: 'notifications_active',
      x: 840,
      y: 65,
      width: 180,
      height: 85,
      badge: 'Device Wakeup Nudge',
      color: 'rose'
    },
    {
      id: 'delivery-ack-processor',
      label: 'Receipt & Status Processor',
      sublabel: 'Single Tick • Double Tick • Blue Tick',
      tier: 'routing-tier',
      tierLabel: 'Status Sync',
      category: 'Stateless Compute',
      icon: 'done_all',
      x: 840,
      y: 190,
      width: 180,
      height: 85,
      badge: 'Idempotent Receipts',
      color: 'teal'
    },
    {
      id: 'prekey-kms',
      label: 'Prekey & Identity Vault',
      sublabel: 'X3DH One-Time Prekeys • Public Keys',
      tier: 'persistence-tier',
      tierLabel: 'Key Agreement',
      category: 'Security & Auth',
      icon: 'vpn_key',
      x: 415,
      y: 470,
      width: 165,
      height: 95,
      badge: 'X3DH Key Bundle',
      color: 'violet'
    },
    {
      id: 'media-object-store',
      label: 'Encrypted Media Store (S3)',
      sublabel: 'Ciphertext Blobs • Client AES-256 Key',
      tier: 'persistence-tier',
      tierLabel: 'Media Store',
      category: 'Object Storage',
      icon: 'cloud_upload',
      x: 620,
      y: 470,
      width: 180,
      height: 95,
      badge: 'Zero-Knowledge Media',
      color: 'cyan'
    }
  ],

  // Directed links between nodes
  links: [
    {
      id: 'link-sender-lb',
      from: 'sender-device',
      to: 'l4-lb',
      label: '1. WebSocket TLS Handshake',
      type: 'forward',
      flows: ['online-delivery', 'offline-delivery', 'receipt-sync'],
      path: 'M 190 232 L 230 232'
    },
    {
      id: 'link-lb-gw-a',
      from: 'l4-lb',
      to: 'conn-gateway-a',
      label: 'TCP Proxy (Proxy Protocol)',
      type: 'forward',
      flows: ['online-delivery', 'offline-delivery'],
      path: 'M 307 190 L 307 140'
    },
    {
      id: 'link-gw-a-msg',
      from: 'conn-gateway-a',
      to: 'message-service',
      label: '2. Ingest Encrypted Envelope',
      type: 'forward',
      flows: ['online-delivery', 'offline-delivery'],
      path: 'M 385 97 L 415 97'
    },
    {
      id: 'link-msg-registry',
      from: 'message-service',
      to: 'session-registry',
      label: '3. Query Recipient Session State',
      type: 'bidirectional',
      flows: ['online-delivery', 'offline-delivery'],
      path: 'M 497 140 L 497 190'
    },
    {
      id: 'link-msg-gw-b',
      from: 'message-service',
      to: 'conn-gateway-b',
      label: '4a. Recipient Online &rarr; Route',
      type: 'forward',
      flows: ['online-delivery'],
      path: 'M 440 140 C 420 180, 420 260, 440 305'
    },
    {
      id: 'link-gw-b-recipient',
      from: 'conn-gateway-b',
      to: 'recipient-device',
      label: '5. Push Downlink WebSocket Packet',
      type: 'forward',
      flows: ['online-delivery'],
      path: 'M 580 345 C 650 345, 650 160, 680 150'
    },
    {
      id: 'link-msg-offline',
      from: 'message-service',
      to: 'offline-message-store',
      label: '4b. Recipient Offline &rarr; Spool',
      type: 'forward',
      flows: ['offline-delivery'],
      path: 'M 580 97 C 600 97, 600 190, 620 215'
    },
    {
      id: 'link-offline-push',
      from: 'offline-message-store',
      to: 'push-service',
      label: '6. Trigger Wakeup Push Notification',
      type: 'forward',
      flows: ['offline-delivery'],
      path: 'M 800 215 C 820 215, 820 120, 840 107'
    },
    {
      id: 'link-push-recipient',
      from: 'push-service',
      to: 'recipient-device',
      label: '7. Silent Push Wakeup (APNs/FCM)',
      type: 'forward',
      flows: ['offline-delivery'],
      path: 'M 840 107 L 800 107'
    },
    {
      id: 'link-recipient-ack',
      from: 'recipient-device',
      to: 'delivery-ack-processor',
      label: '8. Emits Delivery ACK (Double Tick)',
      type: 'forward',
      flows: ['receipt-sync'],
      path: 'M 800 130 C 820 140, 820 190, 840 215'
    },
    {
      id: 'link-ack-sender',
      from: 'delivery-ack-processor',
      to: 'conn-gateway-a',
      label: '9. Route Receipt to Sender Socket',
      type: 'forward',
      flows: ['receipt-sync'],
      path: 'M 840 240 C 700 280, 360 20, 310 55'
    },
    {
      id: 'link-sender-media',
      from: 'sender-device',
      to: 'media-object-store',
      label: 'Upload Encrypted Media Blob (S3)',
      type: 'forward',
      flows: [],
      path: 'M 115 280 C 120 400, 350 515, 620 515'
    }
  ],

  // Step-by-Step Request Flows
  flows: [
    {
      id: 'online-delivery',
      name: '1. Real-Time Online Message Delivery Flow (Double Ratchet)',
      shortDesc: 'Sub-100ms end-to-end delivery when both sender and receiver maintain active persistent WebSocket connections.',
      color: 'emerald',
      steps: [
        {
          step: 1,
          title: 'Sender Encrypts Payload & Dispatches over WebSocket',
          source: 'sender-device',
          target: 'conn-gateway-a',
          desc: 'Sender encrypts plaintext locally using Signal Double Ratchet algorithm. Envelope containing <code>encryptedPayload</code> and client-generated <code>messageId</code> streams over TLS WebSocket to Connection Gateway A.',
          badge: 'Client-Side E2EE Encryption',
          highlightNodes: ['sender-device', 'conn-gateway-a'],
          highlightLinks: ['link-sender-lb', 'link-lb-gw-a']
        },
        {
          step: 2,
          title: 'Message Service Ingestion & Deduplication',
          source: 'conn-gateway-a',
          target: 'message-service',
          desc: 'Gateway passes envelope to Message Service. Service assigns monotonic per-conversation sequence number, verifies sender identity, and returns immediate <strong>Single Tick ACK</strong> (Server Accepted) to sender in <strong>15ms</strong>.',
          badge: 'Single Tick (Accepted)',
          highlightNodes: ['conn-gateway-a', 'message-service'],
          highlightLinks: ['link-gw-a-msg']
        },
        {
          step: 3,
          title: 'Session Registry Query Confirms Recipient Online',
          source: 'message-service',
          target: 'session-registry',
          desc: 'Message Service queries Redis Session Registry for <code>user-b</code>. Finds active session mapping: <code>user-b &rarr; conn-gateway-b:pod-18</code>.',
          badge: 'Redis Presence Lookup (< 2ms)',
          highlightNodes: ['message-service', 'session-registry'],
          highlightLinks: ['link-msg-registry']
        },
        {
          step: 4,
          title: 'Inter-Gateway Forwarding to Recipient Socket',
          source: 'message-service',
          target: 'conn-gateway-b',
          desc: 'Message Service routes encrypted envelope over internal high-speed gRPC/mTLS bus to Connection Gateway B, which holds the active socket for Recipient.',
          badge: 'Inter-Gateway Forwarding',
          highlightNodes: ['message-service', 'conn-gateway-b'],
          highlightLinks: ['link-msg-gw-b']
        },
        {
          step: 5,
          title: 'Direct Downlink Push & Local Decryption',
          source: 'conn-gateway-b',
          target: 'recipient-device',
          desc: 'Gateway B pushes the packet down the open WebSocket connection. Recipient device advances ratchet state, decrypts payload locally, and displays notification in <strong>75ms</strong> total latency.',
          badge: 'P99 Delivery (< 100ms)',
          highlightNodes: ['conn-gateway-b', 'recipient-device'],
          highlightLinks: ['link-gw-b-recipient']
        }
      ]
    },
    {
      id: 'offline-delivery',
      name: '2. Offline Recipient Buffering & Push Notification Flow',
      shortDesc: 'Guarantees zero message loss when recipient is disconnected, waking device via APNs/FCM and flushing queue upon reconnect.',
      color: 'blue',
      steps: [
        {
          step: 1,
          title: 'Session Registry Indicates Recipient Offline',
          source: 'message-service',
          target: 'session-registry',
          desc: 'Message Service queries Session Registry. Key <code>user-b</code> does not exist in Redis, confirming recipient device is currently disconnected.',
          badge: 'Offline Detected',
          highlightNodes: ['message-service', 'session-registry'],
          highlightLinks: ['link-msg-registry']
        },
        {
          step: 2,
          title: 'Persist Encrypted Message to Cassandra Spool',
          source: 'message-service',
          target: 'offline-message-store',
          desc: 'Message Service writes encrypted envelope to Cassandra Offline Message Spool partitioned by <code>recipient_id</code> with a 30-day TTL: <code>INSERT INTO offline_messages (recipient_id, message_id, payload)</code>.',
          badge: 'Durable Spool Persisted',
          highlightNodes: ['message-service', 'offline-message-store'],
          highlightLinks: ['link-msg-offline']
        },
        {
          step: 3,
          title: 'Trigger Wakeup Push Notification (APNs / FCM)',
          source: 'offline-message-store',
          target: 'push-service',
          desc: 'Push notification engine dispatches silent wakeup push to Apple APNs / Google FCM containing: <code>{ "type": "NEW_MESSAGE", "badge": 1 }</code> (no message plaintext).',
          badge: 'Silent Wakeup Nudge',
          highlightNodes: ['offline-message-store', 'push-service'],
          highlightLinks: ['link-offline-push']
        },
        {
          step: 4,
          title: 'Recipient Reconnects & Re-establishes WebSocket',
          source: 'recipient-device',
          target: 'conn-gateway-b',
          desc: 'Recipient device receives push notification, wakes up radio, and opens TLS WebSocket to Connection Gateway B, registering active presence in Redis.',
          badge: 'Auto-Reconnect Presence',
          highlightNodes: ['recipient-device', 'conn-gateway-b'],
          highlightLinks: ['link-gw-b-recipient']
        },
        {
          step: 5,
          title: 'Drain Offline Spool & Acknowledge Deletion',
          source: 'conn-gateway-b',
          target: 'offline-message-store',
          desc: 'Gateway flushes all pending spooled messages in chronological order. Upon recipient delivery confirmation, messages are permanently purged from server disks.',
          badge: 'Queue Drained & Purged',
          highlightNodes: ['conn-gateway-b', 'offline-message-store', 'recipient-device'],
          highlightLinks: ['link-gw-b-recipient']
        }
      ]
    },
    {
      id: 'receipt-sync',
      name: '3. Multi-Tick Delivery & Read Receipt Synchronization Flow',
      shortDesc: 'Orchestrates the lifecycle of message status ticks: Server Accepted (1 tick), Delivered (2 ticks), and Read (Blue ticks).',
      color: 'rose',
      steps: [
        {
          step: 1,
          title: 'Recipient Device Emits Delivery Receipt',
          source: 'recipient-device',
          target: 'delivery-ack-processor',
          desc: 'When recipient device writes message to local SQLite store, it automatically transmits <code>DELIVERY_ACK(messageId)</code> over its active WebSocket connection.',
          badge: 'Device Delivery ACK',
          highlightNodes: ['recipient-device', 'delivery-ack-processor'],
          highlightLinks: ['link-recipient-ack']
        },
        {
          step: 2,
          title: 'Receipt Processor Records State & Purges Spool',
          source: 'delivery-ack-processor',
          target: 'offline-message-store',
          desc: 'Status processor updates delivery state in metadata store. If message was buffered in offline spool, it issues immediate delete to reclaim disk space.',
          badge: 'Server Purge Confirmed',
          highlightNodes: ['delivery-ack-processor', 'offline-message-store'],
          highlightLinks: []
        },
        {
          step: 3,
          title: 'Locate Sender Gateway via Session Registry',
          source: 'delivery-ack-processor',
          target: 'session-registry',
          desc: 'Processor queries Redis for sender’s current active gateway. Finds sender on Connection Gateway A.',
          badge: 'Sender Session Located',
          highlightNodes: ['delivery-ack-processor', 'session-registry'],
          highlightLinks: []
        },
        {
          step: 4,
          title: 'Deliver Double Gray Tick to Sender App',
          source: 'delivery-ack-processor',
          target: 'conn-gateway-a',
          desc: 'Gateway A delivers status packet to sender device. Sender UI updates single gray checkmark into <strong>Double Gray Checkmarks (Delivered)</strong>.',
          badge: 'Double Tick (Delivered)',
          highlightNodes: ['delivery-ack-processor', 'conn-gateway-a', 'sender-device'],
          highlightLinks: ['link-ack-sender']
        },
        {
          step: 5,
          title: 'User Reads Chat & Emits Blue Read Receipt',
          source: 'recipient-device',
          target: 'sender-device',
          desc: 'When recipient opens chat view, device transmits <code>READ_RECEIPT(messageId)</code> (if privacy setting enabled). Sender UI updates checkmarks to <strong>Blue Double Checkmarks (Read)</strong>.',
          badge: 'Blue Double Tick (Read)',
          highlightNodes: ['recipient-device', 'sender-device'],
          highlightLinks: []
        }
      ]
    }
  ],

  // Detailed Component Specifications for Inspector Panel
  components: {
    'sender-device': {
      id: 'sender-device',
      name: 'Sender Client Application (iOS / Android / Web)',
      tier: 'Client Tier',
      category: 'Client Tier',
      responsibilities: [
        'Encrypt message bodies and media encryption keys locally using the Signal Protocol (Double Ratchet Algorithm)',
        'Maintain persistent TLS-encrypted WebSocket connection to nearest edge Connection Gateway',
        'Persist chat history, message states, and cryptographic session keys in local encrypted SQLite (SQLCipher)',
        'Generate deterministic client-side message IDs (UUID / Snowflake) to enable idempotent server deduplication'
      ],
      apis: [
        'SEND_MESSAGE(recipientId, encryptedPayload, clientMsgId)',
        'RECEIVE_ACK(msgId, status: "SERVER_ACK" | "DELIVERED" | "READ")'
      ],
      storage: 'Local device flash memory; SQLite encrypted database storing plaintext messages and private identity ratchet keys',
      ha: 'Hundreds of millions of independent autonomous client nodes distributed globally',
      failureModes: [
        'Network Blip During Send: Client queues message in local SQLite outbox and retries with identical messageId upon reconnect'
      ],
      tradeoffs: [
        'Client-Side Storage vs Cloud Chat History: WhatsApp stores messages on the user\'s physical device, meaning server compromise cannot leak historical plaintext chats'
      ]
    },

    'l4-lb': {
      id: 'l4-lb',
      name: 'L4 Anycast Load Balancer (NLB / Maglev)',
      tier: 'Connection & Ingress Tier',
      category: 'Edge & Ingress',
      responsibilities: [
        'Terminate TCP connections at the edge using BGP Anycast routing to steer mobile users to the nearest data center',
        'Balance 100+ million concurrent long-lived persistent TCP/WebSocket connections across Connection Gateways',
        'Perform zero SSL decryption to maximize throughput and preserve end-to-end TLS integrity',
        'Forward client IP information to backend gateways via PROXY Protocol v2 headers'
      ],
      apis: [
        'TCP 443 / 5222 — Standard TLS / XMPP / WebSocket port pass-through'
      ],
      storage: 'In-memory connection tracking hash table (IPVS / eBPF kernel maps)',
      ha: 'Active-Active multi-AZ deployment with sub-second BGP ECMP Anycast route withdrawal upon node death',
      failureModes: [
        'Re-balance Connection Severing: BGP route flap can re-route existing TCP flow to another LB node; mitigated by Maglev consistent 5-tuple hashing'
      ],
      tradeoffs: [
        'L4 Pass-Through vs L7 Application Load Balancer: L4 handles 10x more concurrent TCP connections per server with zero application-layer memory buffering'
      ]
    },

    'conn-gateway-a': {
      id: 'conn-gateway-a',
      name: 'Connection Gateway Fleet (Erlang / BEAM / Go)',
      tier: 'Connection & Ingress Tier',
      category: 'Connection Fleet',
      responsibilities: [
        'Maintain millions of concurrent, long-lived, lightweight persistent connections per physical host (e.g., Erlang processes / Go goroutines)',
        'Handle TLS decryption and protocol framing (WebSocket / Noise Protocol / protobuf)',
        'Register active device presence and gateway host mapping in Session Registry upon connection',
        'Heartbeat monitoring: receive client keep-alive pings every 60s and teardown dead sockets promptly'
      ],
      apis: [
        'WS /ws/v1/chat — Persistent bidirectional WebSocket endpoint',
        'TCP Ping / Pong frames for connection liveness'
      ],
      storage: 'Ephemeral Linux kernel socket file descriptors (uLimit = 2,000,000 FDs) and ~10 KB memory per connection',
      ha: 'Stateless horizontally autoscaled pods; connection death simply prompts mobile client to reconnect to another pod',
      failureModes: [
        'Thundering Herd Reconnect: Network blip drops 5M connections simultaneously; clients apply exponential backoff with jitter on reconnect'
      ],
      tradeoffs: [
        'Erlang / Elixir (BEAM) vs C++ (epoll) vs Go: Erlang BEAM provides isolated per-connection processes with preemptive scheduling, preventing a single slow socket from blocking others'
      ]
    },

    'message-service': {
      id: 'message-service',
      name: 'Message Routing & Ordering Service',
      tier: 'Routing & Session Tier',
      category: 'Stateless Compute',
      responsibilities: [
        'Deduplicate incoming messages using <code>clientMsgId</code> against Redis cache to prevent duplicate processing',
        'Assign strictly increasing monotonic sequence numbers per conversation to guarantee ordered display',
        'Query Session Registry to determine whether recipient is online or offline',
        'Emit immediate Server Acknowledgment (Single Tick) back to sender gateway within 20ms'
      ],
      apis: [
        'routeMessage(senderId, recipientId, encryptedPayload, msgId) -> Status',
        'generateConversationSeq(chatId) -> MonotonicInt'
      ],
      storage: 'Stateless compute pods with local connection pools to Redis and Cassandra',
      ha: 'Autoscaled Kubernetes pods distributed across 3 Availability Zones',
      failureModes: [
        'Redis Cluster Slowness: Degrades presence lookup from 2ms to 20ms; mitigated by pipelined Redis connection pools'
      ],
      tradeoffs: [
        'Per-Conversation Ordering vs Global Distributed Order: Ordering messages per conversation partition requires zero cross-datacenter locking, enabling millions of parallel chats'
      ]
    },

    'session-registry': {
      id: 'session-registry',
      name: 'Session & Presence Registry (Distributed Redis)',
      tier: 'Routing & Session Tier',
      category: 'In-Memory Store',
      responsibilities: [
        'Maintain global authoritative mapping of active user devices to their specific Connection Gateway host (e.g. <code>user_123 &rarr; gateway-pod-42.internal</code>)',
        'Track user online/offline presence status and "Last Seen" timestamps',
        'Store ephemeral heartbeat lease with 120-second TTL; automatically expires if client stops pinging'
      ],
      apis: [
        'SET session:{userId} {gatewayId} EX 120',
        'GET session:{userId} -> gatewayId',
        'DEL session:{userId}'
      ],
      storage: 'Sharded Redis cluster (RAM) storing 500M+ active device sessions (~50 GB RAM total)',
      ha: 'Primary-Replica pairing across AZs with Redis Sentinel automated failover (< 3s)',
      failureModes: [
        'Stale Gateway Session: Client disconnected dirty, but key has not expired yet; gateway B returns socket error, prompting message service to fallback to offline spool'
      ],
      tradeoffs: [
        'Centralized Redis Presence vs P2P Gossip Protocol: Centralized Redis provides O(1) instantaneous lookups at scale without gossip bandwidth saturation'
      ]
    },

    'conn-gateway-b': {
      id: 'conn-gateway-b',
      name: 'Connection Gateway B (Recipient Host)',
      tier: 'Connection & Ingress Tier',
      category: 'Connection Fleet',
      responsibilities: [
        'Hold active TCP/WebSocket connection for recipient device',
        'Receive internal forwarded messages from Message Service over gRPC',
        'Serialize encrypted envelope into binary wire format and push down recipient\'s open socket',
        'Buffer unacknowledged in-flight packets until client transmits socket-level TCP/protocol ACK'
      ],
      apis: [
        'gRPC pushDownlink(userId, messageEnvelope) -> Ack',
        'WebSocket binary frame streaming'
      ],
      storage: 'In-memory per-connection socket buffer (< 64 KB per active connection)',
      ha: 'Redundant gateway pool with multi-homing capability',
      failureModes: [
        'Client Socket Half-Open: Recipient dropped connection without sending TCP FIN; write fails, gateway clears session and returns offline status'
      ],
      tradeoffs: [
        'Push over WebSocket vs Polling: Push delivers messages in < 100ms with zero battery-draining polling traffic on mobile devices'
      ]
    },

    'recipient-device': {
      id: 'recipient-device',
      name: 'Recipient Client Device (iOS / Android)',
      tier: 'Client Tier',
      category: 'Client Tier',
      responsibilities: [
        'Advance local cryptographic Double Ratchet state to derive matching decryption key',
        'Decrypt ciphertext message body and verify HMAC cryptographic authenticity',
        'Render message in conversation UI and persist to local encrypted SQLite storage',
        'Automatically transmit <code>DELIVERY_ACK</code> and optional <code>READ_ACK</code> back to server'
      ],
      apis: [
        'DECRYPT_PAYLOAD(encryptedPayload, senderRatchetKey)',
        'EMIT_ACK(msgId, type: "DELIVERED" | "READ")'
      ],
      storage: 'Encrypted flash storage on mobile device',
      ha: 'Mobile device client runtime',
      failureModes: [
        'Out-of-Sync Ratchet Keys: Occurs if multiple messages were dropped; client requests session re-negotiation via Prekey exchange'
      ],
      tradeoffs: [
        'Device-Only Decryption: Server has zero access to message plaintext, fulfilling strict zero-knowledge security mandate'
      ]
    },

    'offline-message-store': {
      id: 'offline-message-store',
      name: 'Offline Message Spool (Apache Cassandra / ScyllaDB)',
      tier: 'Routing & Session Tier',
      category: 'Persistence Tier',
      responsibilities: [
        'Buffer encrypted messages for disconnected recipients for up to 30 days',
        'Store messages partitioned by <code>recipient_id</code> ordered by monotonic sequence timestamp',
        'Support high write throughput during flash holidays (e.g. New Year\'s Eve spikes)',
        'Permanently delete spooled rows immediately after receiving client delivery confirmation'
      ],
      apis: [
        'INSERT INTO offline_messages (recipient_id, message_id, payload) USING TTL 2592000',
        'SELECT * FROM offline_messages WHERE recipient_id = ? ORDER BY seq ASC',
        'DELETE FROM offline_messages WHERE recipient_id = ? AND message_id = ?'
      ],
      storage: 'Distributed wide-column store on NVMe SSDs; ephemeral temporary storage footprint',
      ha: 'Multi-datacenter replication with tunable consistency (Local Quorum writes)',
      failureModes: [
        'Tombsone Overload in Cassandra: High volume of deletions creates tombstones; mitigated by ScyllaDB or time-window compaction strategies (TWCS)'
      ],
      tradeoffs: [
        'Cassandra vs Redis for Offline Storage: Cassandra provides durable SSD persistence across server crashes, whereas Redis RAM would be cost-prohibitive for 30-day spools'
      ]
    },

    'push-service': {
      id: 'push-service',
      name: 'Push Notification Service (APNs / FCM)',
      tier: 'Storage, Media & Push Tier',
      category: 'Notification Engine',
      responsibilities: [
        'Send low-priority silent wakeup notifications to Apple Push Notification service (APNs) and Google FCM',
        'Nudge backgrounded or sleeping mobile operating systems to wake up and connect to WebSocket gateway',
        'Transmit zero message body plaintext in push payload to prevent Apple/Google from intercepting content',
        'Throttle push notifications to avoid draining user phone batteries during rapid group chats'
      ],
      apis: [
        'POST https://api.push.apple.com/3/device/{token} — APNs HTTP/2 client',
        'POST https://fcm.googleapis.com/v1/projects/{id}/messages:send — FCM API'
      ],
      storage: 'Device push token registry mapping <code>userId &rarr; {apns_token, fcm_token}</code>',
      ha: 'Stateless worker fleet with connection pooling to Apple/Google push servers',
      failureModes: [
        'Third-Party Push Provider Delay: APNs/FCM delivery can be delayed by minutes; treated as a best-effort wakeup signal'
      ],
      tradeoffs: [
        'Silent Wakeup vs Full Push Payload: Silent push keeps message content end-to-end encrypted; payload push would leak metadata to third-party operating systems'
      ]
    },

    'delivery-ack-processor': {
      id: 'delivery-ack-processor',
      name: 'Receipt & Status Synchronization Processor',
      tier: 'Routing & Session Tier',
      category: 'Stateless Compute',
      responsibilities: [
        'Process incoming receipt events: Server ACK (1 gray tick), Device Delivered (2 gray ticks), Read (2 blue ticks)',
        'Make receipt processing strictly idempotent: duplicate receipt ACKs produce no side-effects',
        'Locate sender\'s active connection gateway and forward the receipt update packet in real time',
        'Trigger asynchronous deletion of delivered messages from the offline spool database'
      ],
      apis: [
        'processDeliveryAck(msgId, recipientId, timestamp)',
        'processReadAck(msgId, recipientId, timestamp)'
      ],
      storage: 'Stateless microservice reading and writing to Kafka receipt topics',
      ha: 'Kafka consumer group with parallel partitions auto-balanced across worker pods',
      failureModes: [
        'Sender Offline When Receipt Emitted: Receipt is stored in sender\'s offline receipt spool and delivered when sender reconnects'
      ],
      tradeoffs: [
        'Separate Receipt Stream vs Piggybacking on Messages: Dedicated receipt stream allows instant tick updates without waiting for return chat messages'
      ]
    },

    'prekey-kms': {
      id: 'prekey-kms',
      name: 'Prekey & Identity Key Vault (Signal X3DH)',
      tier: 'Storage, Media & Push Tier',
      category: 'Security & Auth',
      responsibilities: [
        'Store users\' public identity keys, signed prekeys, and a pool of one-time prekeys (X3DH protocol)',
        'Supply prekey bundles to senders initiating a new conversation with a first-time contact',
        'Allow asynchronous end-to-end encryption setup even when the recipient is completely offline',
        'Alert user client when an existing contact\'s public identity key changes (Safety Number notification)'
      ],
      apis: [
        'GET /api/v1/keys/{userId}/prekey-bundle -> { identityKey, signedPrekey, oneTimePrekey }',
        'POST /api/v1/keys/replenish-prekeys -> Status'
      ],
      storage: 'PostgreSQL Key Registry with hardware security module (HSM) signing verification',
      ha: 'Read replicas distributed geographically for rapid key bundle lookups',
      failureModes: [
        'One-Time Prekeys Exhausted: If user runs out of one-time prekeys, server falls back to signed prekey, slightly weakening forward secrecy until replenished'
      ],
      tradeoffs: [
        'X3DH Asynchronous Key Exchange vs Diffie-Hellman Online Exchange: X3DH allows initiating encrypted sessions without requiring both parties to be online simultaneously'
      ]
    },

    'media-object-store': {
      id: 'media-object-store',
      name: 'Encrypted Media Storage (AWS S3 / Cloud Blob)',
      tier: 'Storage, Media & Push Tier',
      category: 'Object Storage',
      responsibilities: [
        'Store large media files (photos, videos, voice notes, documents) encrypted with client-side AES-256 keys',
        'Server has zero knowledge of encryption keys: decryption keys are passed directly inside end-to-end encrypted chat envelopes',
        'Direct client-to-S3 presigned download and upload paths to bypass messaging server bandwidth limits',
        'Enforce 14-day retention policy: media blobs are purged after recipient successfully downloads them'
      ],
      apis: [
        'PUT /encrypted-media/{mediaHash} — Client direct encrypted upload',
        'GET /encrypted-media/{mediaHash} — Recipient direct download'
      ],
      storage: 'AWS S3 Standard with lifecycle policy auto-purging objects older than 14 days',
      ha: 'Global S3 replication with CloudFront edge caching for ciphertext blocks',
      failureModes: [
        'Media Expired Before Recipient Download: Recipient sees "Media expired or unavailable" UI; sender must re-upload'
      ],
      tradeoffs: [
        'Client-Side Media Encryption vs Server-Side Encryption: Client encrypts media with random symmetric key before upload; server stores pure ciphertext and cannot inspect files'
      ]
    }
  },

  // System-level Architectural Trade-offs
  tradeoffs: [
    {
      id: 'to-connection-protocol',
      decision: 'Persistent Protocol: WebSockets vs HTTP/2 Server-Sent Events vs Long Polling',
      optionA: {
        name: 'Persistent TLS WebSocket (Selected Default)',
        pros: 'Full-duplex bidirectional communication with minimal 2-byte framing overhead. Instant client-to-server and server-to-client streaming over a single TCP socket.',
        cons: 'Requires stateful connection gateways; load balancers cannot perform simple round-robin HTTP request-level balancing.'
      },
      optionB: {
        name: 'HTTP/2 Server-Sent Events (SSE) + REST Outbound',
        pros: 'Multiplexed server-to-client streaming with automatic reconnection built into HTTP/2 standards.',
        cons: 'Half-duplex only: outbound messages from mobile client still require separate HTTP POST requests, adding header overhead and connection handshake latency.'
      },
      verdict: 'Recommended: Persistent TLS WebSockets (or custom Noise-protocol over TCP) for sub-100ms real-time chat with minimal battery consumption.',
      relatedNodes: ['sender-device', 'conn-gateway-a', 'recipient-device', 'conn-gateway-b']
    },
    {
      id: 'to-storage-model',
      decision: 'Message Storage Model: Ephemeral In-Transit Storage vs Permanent Cloud Chat History',
      optionA: {
        name: 'Ephemeral In-Transit Spool (WhatsApp Model) (Selected Default)',
        pros: 'Privacy by design: server permanently purges message immediately upon delivery acknowledgment. Minimal database storage costs; impossible for subpoena or server breach to expose chat histories.',
        cons: 'Multi-device synchronization is significantly harder; user loses chat history if they lose their physical phone without local backup.'
      },
      optionB: {
        name: 'Permanent Server-Side Cloud Storage (Telegram / Slack Model)',
        pros: 'Effortless multi-device synchronization; users can log into any device and immediately access complete 10-year conversation archives.',
        cons: 'Massive multi-petabyte database storage costs; server holds user chat data, requiring complex cloud encryption and raising privacy liabilities.'
      },
      verdict: 'Recommended: Ephemeral In-Transit Spool with 30-day offline expiration. Delivered messages are deleted from server disks immediately.',
      relatedNodes: ['message-service', 'offline-message-store', 'delivery-ack-processor']
    },
    {
      id: 'to-ordering',
      decision: 'Message Ordering: Per-Conversation Sequence vs Global Distributed Clock Synchronization',
      optionA: {
        name: 'Per-Conversation Monotonic Sequence Generator (Selected Default)',
        pros: 'Guarantees strictly ordered messages within each chat room. Requires zero global cross-partition locks or complex TrueTime atomic clocks.',
        cons: 'Does not guarantee absolute global chronological ordering across two completely unrelated conversations in different parts of the world (which is irrelevant for chat).'
      },
      optionB: {
        name: 'Global Distributed Clock Ordering (Spanner / Lamport Clocks)',
        pros: 'Provides a single linearizable global timeline across all messages sent on the platform.',
        cons: 'Massive synchronization latency penalty (adds 50–100ms cross-region consensus wait per message); completely unnecessary for human conversation.'
      },
      verdict: 'Recommended: Per-Conversation Sequence Generator partitioned by `conversation_id` for deterministic causal ordering.',
      relatedNodes: ['message-service', 'recipient-device', 'sender-device']
    },
    {
      id: 'to-encryption',
      decision: 'End-to-End Encryption: Signal Protocol (Double Ratchet) vs Server-Side TLS Encryption',
      optionA: {
        name: 'Client-Side Signal Protocol Double Ratchet (Selected Default)',
        pros: 'Zero-knowledge architecture: only the intended recipient possesses the private keys to decrypt the message. Protects users against rogue employees, server compromise, and man-in-the-middle attacks.',
        cons: 'Server cannot perform content moderation, server-side keyword search, automated spam detection, or cloud-based link previews.'
      },
      optionB: {
        name: 'Standard Transport-Layer TLS Encryption (Server Decrypts)',
        pros: 'Server can inspect content, perform server-side search indexing, detect malicious links, and run spam filter models.',
        cons: 'Server holds plaintext messages in memory; vulnerable to insider threats, data breaches, and state actor interception.'
      },
      verdict: 'Recommended: Signal Protocol Double Ratchet with X3DH key agreement. Client holds sole decryption capability.',
      relatedNodes: ['sender-device', 'recipient-device', 'prekey-kms']
    },
    {
      id: 'to-presence-tracking',
      decision: 'Presence & Online Status: Centralized Heartbeat Poll vs Push-Based Presence Broadcast',
      optionA: {
        name: 'Lazy Pull on Demand with Ephemeral Heartbeats (Selected Default)',
        pros: 'Presence is queried only when user opens an active chat window with a contact; prevents quadratic $O(N^2)$ broadcast storms across millions of mutual contacts.',
        cons: 'Presence indicators may be slightly delayed by a few seconds if a contact unexpectedly loses connection.'
      },
      optionB: {
        name: 'Eager Broadcast Presence to All Address Book Contacts',
        pros: 'Every contact sees real-time "online" indicator immediately without requesting it.',
        cons: 'Catastrophic network amplification: when an active user connects, system must broadcast status to 1,000 phonebook contacts, generating billions of wasted presence packets.'
      },
      verdict: 'Recommended: Lazy Pull Presence on demand when opening chat screen, backed by 60-second Redis heartbeat leases.',
      relatedNodes: ['session-registry', 'conn-gateway-a', 'conn-gateway-b']
    }
  ]
};
