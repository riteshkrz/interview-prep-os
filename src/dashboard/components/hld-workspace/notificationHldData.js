/**
 * Notification System High-Level Architecture (HLD) Data Specification
 * Pure architecture data model separated from presentation.
 * Supports:
 * - Architecture topology (nodes, tiers, links)
 * - Request flows (Transactional OTP Flow, Bulk Marketing Flow, Provider Retry & DLQ Flow)
 * - Detailed component specifications (Responsibilities, APIs, Storage, Trade-offs, Failure modes)
 * - System-level architectural trade-offs
 */

export const NOTIFICATION_HLD_DATA = {
  lessonId: 'notification',
  title: 'Distributed Notification System High-Level Architecture',
  systemName: 'Multi-Channel Asynchronous Notification Engine (Push, SMS, Email)',
  scaleMetrics: {
    monthlyCreates: '100 Million sends/day',
    avgWriteRps: '~1,200 requests/sec',
    peakWriteRps: '~50,000 requests/sec (Flash Spikes)',
    monthlyRedirects: '3 Billion notifications/mo',
    avgReadRps: '~5,000 webhook events/sec',
    peakReadRps: '~30,000 webhook events/sec',
    targetRedirectLatency: '< 1 sec (OTP) / < 15 min (Bulk)',
    storagePerYear: '~2 TB delivery receipts & audit log'
  },

  scaleMetricsList: [
    { label: 'Daily Volume', value: '100M sends / day', color: 'blue' },
    { label: 'Peak Ingestion', value: '50,000 req/sec', color: 'cyan' },
    { label: 'OTP SLA', value: '< 1 second P99', color: 'indigo' },
    { label: 'Channels Supported', value: 'Push • SMS • Email • In-App', color: 'emerald' },
    { label: 'Reliability', value: 'At-Least-Once + DLQ', color: 'amber' }
  ],

  // Tier boundaries for the SVG Canvas (viewBox 0 0 1100 680)
  tierBoxes: [
    { x: 210, y: 30, w: 390, h: 390, textX: 225, textY: 55, title: 'INGRESS & TEMPLATING TIER', color: 'indigo' },
    { x: 615, y: 30, w: 430, h: 400, textX: 630, textY: 55, title: 'DURABLE QUEUE & CHANNEL WORKER TIER', color: 'blue' },
    { x: 210, y: 440, w: 835, h: 225, textX: 225, textY: 465, title: 'FEEDBACK & DELIVERY AUDIT PIPELINE (PROVIDER WEBHOOKS)', color: 'amber' }
  ],

  // Architectural Tiers for grouping
  tiers: [
    { id: 'client-tier', name: 'Producer Tier', color: 'slate' },
    { id: 'ingress-tier', name: 'Edge Ingress & Ingestion Tier', color: 'indigo' },
    { id: 'compute-tier', name: 'Core Processing & Routing Tier', color: 'blue' },
    { id: 'storage-tier', name: 'Durable Queues & Channel Workers', color: 'emerald' },
    { id: 'analytics-tier', name: 'Delivery Feedback & Audit Tier', color: 'amber' }
  ],

  // Interactive Nodes on the SVG Canvas (viewBox 0 0 1100 680)
  nodes: [
    {
      id: 'producers',
      label: 'Event Sources & Services',
      sublabel: 'Orders • Auth OTP • Marketing • Billing',
      tier: 'client-tier',
      tierLabel: 'Event Producers',
      category: 'Producer Tier',
      icon: 'campaign',
      x: 40,
      y: 190,
      width: 150,
      height: 90,
      badge: 'Upstream Services',
      color: 'slate'
    },
    {
      id: 'api-gateway',
      label: 'Notification API Gateway',
      sublabel: 'Rate Limiter • Idempotency • Auth',
      tier: 'ingress-tier',
      tierLabel: 'Edge Ingress',
      category: 'Edge & Ingress',
      icon: 'hub',
      x: 230,
      y: 190,
      width: 155,
      height: 90,
      badge: 'API Gateway',
      color: 'indigo'
    },
    {
      id: 'notif-svc',
      label: 'Notification Core Service',
      sublabel: 'Validation • Priority Dispatch • Outbox',
      tier: 'compute-tier',
      tierLabel: 'Core Engine',
      category: 'Stateless Compute',
      icon: 'forward_to_inbox',
      x: 420,
      y: 190,
      width: 165,
      height: 95,
      badge: 'Transactional Core',
      color: 'blue'
    },
    {
      id: 'pref-template-svc',
      label: 'Preferences & Templates',
      sublabel: 'User Consent • Multi-Lingual Mustache',
      tier: 'compute-tier',
      tierLabel: 'Personalization',
      category: 'Stateless Compute',
      icon: 'tune',
      x: 420,
      y: 55,
      width: 165,
      height: 85,
      badge: 'Hydration Engine',
      color: 'amber'
    },
    {
      id: 'user-db',
      label: 'User Preferences DB',
      sublabel: 'PostgreSQL Opt-Ins & Devices',
      tier: 'storage-tier',
      tierLabel: 'Consent Store',
      category: 'Storage & Caching',
      icon: 'database',
      x: 630,
      y: 55,
      width: 175,
      height: 85,
      badge: 'Durable Registry',
      color: 'emerald'
    },
    {
      id: 'priority-queue',
      label: 'Partitioned Message Queues',
      sublabel: 'Kafka / RabbitMQ (High vs Bulk)',
      tier: 'compute-tier',
      tierLabel: 'Durable Buffer',
      category: 'Messaging',
      icon: 'move_down',
      x: 630,
      y: 180,
      width: 175,
      height: 95,
      badge: 'Segregated Queues',
      color: 'amber'
    },
    {
      id: 'push-worker',
      label: 'Push Worker (APNs / FCM)',
      sublabel: 'Apple APNs • Google FCM Gateways',
      tier: 'storage-tier',
      tierLabel: 'Push Channel',
      category: 'Channel Worker',
      icon: 'notifications_active',
      x: 855,
      y: 70,
      width: 170,
      height: 75,
      badge: 'Mobile Push',
      color: 'cyan'
    },
    {
      id: 'sms-worker',
      label: 'SMS Worker (Twilio / Sinch)',
      sublabel: 'Telco Gateways • Auto-Failover',
      tier: 'storage-tier',
      tierLabel: 'SMS Channel',
      category: 'Channel Worker',
      icon: 'sms',
      x: 855,
      y: 160,
      width: 170,
      height: 75,
      badge: 'SMS / OTP',
      color: 'emerald'
    },
    {
      id: 'email-worker',
      label: 'Email Worker (SES / SendGrid)',
      sublabel: 'SMTP / REST • DKIM & Rate Caps',
      tier: 'storage-tier',
      tierLabel: 'Email Channel',
      category: 'Channel Worker',
      icon: 'mail',
      x: 855,
      y: 250,
      width: 170,
      height: 75,
      badge: 'Email Dispatch',
      color: 'blue'
    },
    {
      id: 'dlq',
      label: 'Dead-Letter Queue (DLQ)',
      sublabel: 'Repeated Failures • Poison Pills',
      tier: 'compute-tier',
      tierLabel: 'Error Isolation',
      category: 'Messaging',
      icon: 'error',
      x: 630,
      y: 310,
      width: 175,
      height: 85,
      badge: 'Quarantine Buffer',
      color: 'rose'
    },
    {
      id: 'webhook-ingress',
      label: 'Webhook Status Ingress',
      sublabel: 'Delivery Receipts • Bounces • Clicks',
      tier: 'analytics-tier',
      tierLabel: 'Feedback Ingress',
      category: 'Edge & Ingress',
      icon: 'sync',
      x: 420,
      y: 470,
      width: 165,
      height: 90,
      badge: 'Receipt Collector',
      color: 'indigo'
    },
    {
      id: 'delivery-db',
      label: 'Delivery Audit & Analytics DB',
      sublabel: 'Cassandra / ClickHouse Audit Log',
      tier: 'analytics-tier',
      tierLabel: 'Audit Storage',
      category: 'Analytics Storage',
      icon: 'receipt_long',
      x: 630,
      y: 470,
      width: 175,
      height: 90,
      badge: 'Audit Trail (7 Years)',
      color: 'violet'
    }
  ],

  // Directed links between nodes
  links: [
    {
      id: 'link-prod-gw',
      from: 'producers',
      to: 'api-gateway',
      label: 'POST /notifications',
      type: 'forward',
      flows: ['transactional', 'bulk', 'dlq-retry'],
      path: 'M 190 235 L 230 235'
    },
    {
      id: 'link-gw-svc',
      from: 'api-gateway',
      to: 'notif-svc',
      label: 'Validate & Check Idempotency',
      type: 'forward',
      flows: ['transactional', 'bulk', 'dlq-retry'],
      path: 'M 385 235 L 420 235'
    },
    {
      id: 'link-svc-pref',
      from: 'notif-svc',
      to: 'pref-template-svc',
      label: '1. Hydrate Template & Check Opt-In',
      type: 'bidirectional',
      flows: ['transactional', 'bulk'],
      path: 'M 502 190 L 502 140'
    },
    {
      id: 'link-pref-db',
      from: 'pref-template-svc',
      to: 'user-db',
      label: 'Query Consent & Devices',
      type: 'bidirectional',
      flows: ['bulk'],
      path: 'M 585 97 L 630 97'
    },
    {
      id: 'link-svc-queue',
      from: 'notif-svc',
      to: 'priority-queue',
      label: '2. Enqueue by Priority & Channel',
      type: 'forward',
      flows: ['transactional', 'bulk', 'dlq-retry'],
      path: 'M 585 227 L 630 227'
    },
    {
      id: 'link-queue-push',
      from: 'priority-queue',
      to: 'push-worker',
      label: 'Pull Push Tasks',
      type: 'forward',
      flows: ['transactional'],
      path: 'M 805 200 C 825 200, 835 110, 855 110'
    },
    {
      id: 'link-queue-sms',
      from: 'priority-queue',
      to: 'sms-worker',
      label: 'Pull Urgent SMS/OTP',
      type: 'forward',
      flows: ['transactional'],
      path: 'M 805 220 L 855 200'
    },
    {
      id: 'link-queue-email',
      from: 'priority-queue',
      to: 'email-worker',
      label: 'Pull Throttled Email Batch',
      type: 'forward',
      flows: ['bulk'],
      path: 'M 805 250 C 825 250, 835 285, 855 285'
    },
    {
      id: 'link-worker-dlq',
      from: 'sms-worker',
      to: 'dlq',
      label: 'Max Retries Exhausted',
      type: 'forward',
      flows: ['dlq-retry'],
      path: 'M 855 225 C 835 235, 825 350, 805 350'
    },
    {
      id: 'link-prov-webhook',
      from: 'email-worker',
      to: 'webhook-ingress',
      label: 'Delivery Callback Webhooks',
      type: 'forward',
      flows: ['transactional', 'bulk', 'dlq-retry'],
      path: 'M 940 325 C 940 430, 600 515, 585 515'
    },
    {
      id: 'link-webhook-audit',
      from: 'webhook-ingress',
      to: 'delivery-db',
      label: 'Write Final Delivery Status',
      type: 'forward',
      flows: ['transactional', 'bulk'],
      path: 'M 585 515 L 630 515'
    }
  ],

  // Step-by-Step Request Flows
  flows: [
    {
      id: 'transactional',
      name: '1. Transactional OTP / Critical Alert Flow',
      shortDesc: 'Sub-second urgent notification dispatch (Login OTP, Fraud Alert) bypassing marketing queues.',
      color: 'emerald',
      steps: [
        {
          step: 1,
          title: 'Critical Trigger Ingested',
          source: 'producers',
          target: 'api-gateway',
          desc: 'Auth Service triggers <code>POST /api/v1/notifications</code> with <code>priority="CRITICAL"</code>, <code>channel="sms"</code>, and a unique <code>Idempotency-Key</code>.',
          badge: 'High Priority Ingest',
          highlightNodes: ['producers', 'api-gateway'],
          highlightLinks: ['link-prod-gw']
        },
        {
          step: 2,
          title: 'Idempotency Validation & Transactional Bypass',
          source: 'api-gateway',
          target: 'notif-svc',
          desc: 'Gateway checks Redis for existing idempotency key. Notification core validates mandatory legal transactional status (bypasses non-essential opt-out filters).',
          badge: 'Deduplication & Validation',
          highlightNodes: ['api-gateway', 'notif-svc'],
          highlightLinks: ['link-gw-svc']
        },
        {
          step: 3,
          title: 'Fast-Track Queue Publishing',
          source: 'notif-svc',
          target: 'priority-queue',
          desc: 'Enqueued immediately onto the dedicated <code>high-priority-sms</code> queue partition with zero head-of-line blocking from bulk marketing jobs.',
          badge: 'Zero Queue Lag',
          highlightNodes: ['notif-svc', 'priority-queue'],
          highlightLinks: ['link-svc-queue']
        },
        {
          step: 4,
          title: 'SMS Worker Dispatches to Telco Gateway',
          source: 'priority-queue',
          target: 'sms-worker',
          desc: 'SMS worker dequeues task, selects primary SMS provider (Twilio), and executes authenticated REST dispatch within 200ms.',
          badge: 'Provider Dispatch (<500ms)',
          highlightNodes: ['priority-queue', 'sms-worker'],
          highlightLinks: ['link-queue-sms']
        },
        {
          step: 5,
          title: 'Provider Webhook Acknowledges Delivery',
          source: 'webhook-ingress',
          target: 'delivery-db',
          desc: 'Twilio sends delivery receipt webhook (DLR). Status processor marks notification as <code>DELIVERED</code> in audit database.',
          badge: 'DLR Verified Delivered',
          highlightNodes: ['webhook-ingress', 'delivery-db'],
          highlightLinks: ['link-prov-webhook', 'link-webhook-audit']
        }
      ]
    },
    {
      id: 'bulk',
      name: '2. Bulk Marketing Campaign Flow',
      shortDesc: 'Processes millions of promotional messages with strict consent validation, rate throttling, and template personalization.',
      color: 'blue',
      steps: [
        {
          step: 1,
          title: 'Campaign Bulk Batch Ingestion',
          source: 'producers',
          target: 'api-gateway',
          desc: 'Marketing campaign job submits batch notification payload containing 1,000,000 user IDs with template <code>black-friday-sale</code>.',
          badge: 'Bulk Campaign Intake',
          highlightNodes: ['producers', 'api-gateway'],
          highlightLinks: ['link-prod-gw']
        },
        {
          step: 2,
          title: 'Consent & Preference Filtering',
          source: 'notif-svc',
          target: 'pref-template-svc',
          desc: 'Hydrates user consent records. Automatically filters out users who unsubscribed from promotional marketing (GDPR / CAN-SPAM compliance).',
          badge: 'Consent Registry Filter',
          highlightNodes: ['notif-svc', 'pref-template-svc', 'user-db'],
          highlightLinks: ['link-svc-pref', 'link-pref-db']
        },
        {
          step: 3,
          title: 'Bulk Queue Segregation & Rate Budgeting',
          source: 'notif-svc',
          target: 'priority-queue',
          desc: 'Valid messages are split into channel-specific bulk queues with strict rate limiters (e.g. max 500 emails/sec to protect domain reputation).',
          badge: 'Rate Budgeting',
          highlightNodes: ['notif-svc', 'priority-queue'],
          highlightLinks: ['link-svc-queue']
        },
        {
          step: 4,
          title: 'Email Workers Personalize & Dispatch',
          source: 'priority-queue',
          target: 'email-worker',
          desc: 'Workers render personalized templates with recipient names and discount codes, then stream messages via SendGrid / Amazon SES.',
          badge: 'Batch Stream Dispatch',
          highlightNodes: ['priority-queue', 'email-worker'],
          highlightLinks: ['link-queue-email']
        },
        {
          step: 5,
          title: 'Bounce & Unsubscribe Tracking',
          source: 'webhook-ingress',
          target: 'delivery-db',
          desc: 'Email provider reports hard bounces and spam complaints; status processor automatically updates user opt-out status in database.',
          badge: 'Automated Unsubscribe',
          highlightNodes: ['webhook-ingress', 'delivery-db'],
          highlightLinks: ['link-prov-webhook', 'link-webhook-audit']
        }
      ]
    },
    {
      id: 'dlq-retry',
      name: '3. Provider Outage, Auto-Failover & DLQ Flow',
      shortDesc: 'Handles downstream provider outages with exponential backoff, secondary provider failover, and poison pill DLQ quarantine.',
      color: 'rose',
      steps: [
        {
          step: 1,
          title: 'Third-Party Provider HTTP 503 Outage',
          source: 'sms-worker',
          target: 'sms-worker',
          desc: 'Primary SMS provider returns HTTP 503 Service Unavailable or network connection timeout.',
          badge: 'Downstream Failure',
          highlightNodes: ['sms-worker'],
          highlightLinks: []
        },
        {
          step: 2,
          title: 'Exponential Backoff with Jitter Retry',
          source: 'sms-worker',
          target: 'priority-queue',
          desc: 'Worker re-enqueues message with delay header: <code>delay = min(2^attempt * 500ms, 30s) + jitter</code> to avoid thundering herd.',
          badge: 'Exponential Backoff',
          highlightNodes: ['sms-worker', 'priority-queue'],
          highlightLinks: ['link-queue-sms']
        },
        {
          step: 3,
          title: 'Circuit Breaker Failover to Secondary Provider',
          source: 'sms-worker',
          target: 'sms-worker',
          desc: 'Circuit breaker detects primary vendor error rate > 50%. Dynamically switches outbound traffic to secondary vendor (Sinch / AWS SNS).',
          badge: 'Vendor Circuit Breaker',
          highlightNodes: ['sms-worker'],
          highlightLinks: []
        },
        {
          step: 4,
          title: 'Poison Pill Quarantine to Dead-Letter Queue',
          source: 'sms-worker',
          target: 'dlq',
          desc: 'If all retries fail (e.g. invalid phone number syntax or persistent carrier rejection), message is routed to DLQ with root-cause error code.',
          badge: 'Quarantine Poison Pill',
          highlightNodes: ['sms-worker', 'dlq'],
          highlightLinks: ['link-worker-dlq']
        },
        {
          step: 5,
          title: 'Operator Alert & Diagnostic Inspection',
          source: 'dlq',
          target: 'delivery-db',
          desc: 'DLQ consumer records failure audit log and emits alert to Datadog/PagerDuty when DLQ backlog depth exceeds 100 messages.',
          badge: 'PagerDuty Alarm',
          highlightNodes: ['dlq', 'delivery-db'],
          highlightLinks: []
        }
      ]
    }
  ],

  // Detailed Component Specifications for Inspector Panel
  components: {
    'producers': {
      id: 'producers',
      name: 'Event Sources & Upstream Services',
      tier: 'Producer Tier',
      tierBadge: 'Internal Clients',
      status: 'Microservices & Scheduled Cron Jobs',
      role: 'Emits notification intents triggered by user activity, billing cycles, security logins, and marketing campaigns.',
      responsibilities: [
        'Generate notification payloads specifying recipient, template, and priority.',
        'Supply a unique `Idempotency-Key` (e.g. `order-confirmation-ord_9981`) to prevent duplicate sends on retries.',
        'Use transactional outbox when notifications must commit alongside database business transactions.'
      ],
      apis: [
        {
          method: 'POST',
          endpoint: '/api/v1/notifications',
          description: 'Enqueue notification intent',
          sample: '{\n  "recipientId": "usr_9981",\n  "templateId": "order_confirmed",\n  "channel": "email",\n  "priority": "HIGH",\n  "params": { "orderId": "12345" }\n}'
        }
      ],
      storageDecisions: [
        {
          type: 'Transactional Outbox',
          decision: 'PostgreSQL outbox table in service domain DB',
          rationale: 'Guarantees the notification intent is persisted in the same ACID transaction as the order creation.'
        }
      ],
      tradeoffs: [
        {
          question: 'Direct HTTP call vs Outbox pattern',
          choice: 'Transactional Outbox',
          upside: 'Eliminates dual-write bugs where order succeeds but notification API call fails.',
          downside: 'Requires an outbox poller process (Debezium / custom worker).'
        }
      ],
      failureModes: 'Producer crash during send. Handled by outbox publisher retry.',
      scalingStrategy: 'Horizontally scaled stateless microservices.'
    },

    'api-gateway': {
      id: 'api-gateway',
      name: 'Notification API Gateway',
      tier: 'Edge Ingress',
      tierBadge: 'Ingress Gate',
      status: 'Kong / Envoy API Gateway',
      role: 'Single ingress contract for internal services, enforcing rate limiting, authentication, and deduplication.',
      responsibilities: [
        'Authenticate internal caller services via mTLS or service JWT tokens.',
        'Validate incoming JSON payload schema against registered template definitions.',
        'Check Redis idempotency cache for duplicate `Idempotency-Key` within 24-hour sliding window.',
        'Return immediate HTTP 202 Accepted with assigned `notificationId`.'
      ],
      apis: [
        {
          method: 'POST',
          endpoint: '/api/v1/notifications',
          description: 'Ingest notification request',
          sample: 'Status: 202 Accepted\nHeaders: X-Notification-ID: ntf_99881\nBody: { "status": "QUEUED" }'
        }
      ],
      storageDecisions: [
        {
          type: 'Idempotency Cache',
          decision: 'Redis string key with 24h TTL: SET key value NX EX 86400',
          rationale: 'Sub-millisecond duplicate check preventing identical messages.'
        }
      ],
      tradeoffs: [
        {
          question: 'Synchronous delivery vs Asynchronous 202 Accepted',
          choice: 'Async 202 Accepted',
          upside: 'Producer response time is < 10ms; decoupled from third-party telco network delays.',
          downside: 'Sender cannot know in real time if the user has physically received the message.'
        }
      ],
      failureModes: 'Redis idempotency cluster outage. Falls back to DB uniqueness constraint on idempotency_key.',
      scalingStrategy: 'Stateless gateway instances autoscale with network ingress volume.'
    },

    'notif-svc': {
      id: 'notif-svc',
      name: 'Notification Core Service',
      tier: 'Stateless Compute',
      tierBadge: 'Core Orchestrator',
      status: 'Stateless Go / Java Service Cluster',
      role: 'Coordinates validation, consent checks, template hydration, and prioritizes routing into channel queues.',
      responsibilities: [
        'Assign message priority (`CRITICAL`, `HIGH`, `NORMAL`, `BULK`).',
        'Invoke Preferences Service to ensure recipient has not opted out of marketing channels.',
        'Ensure critical security notifications (2FA OTP, password reset) bypass promotional opt-outs.',
        'Publish partitioned events into durable message queues with zero message loss.'
      ],
      apis: [
        {
          method: 'INTERNAL EVENT',
          endpoint: 'Queue.publish("sms-high-priority", payload)',
          description: 'Publish to channel-specific priority queue',
          sample: 'Topic: notif.sms.high\nKey: "usr_9981"\nPayload: { "phone": "+123456789", "body": "Your OTP is 812903" }'
        }
      ],
      storageDecisions: [
        {
          type: 'In-Memory Channel Routing Matrix',
          decision: 'Local compiled router rules',
          rationale: 'Instant O(1) routing decision mapping channel type to queue destination.'
        }
      ],
      tradeoffs: [
        {
          question: 'Single queue for all channels vs Dedicated channel queues',
          choice: 'Dedicated Queues per Channel (Push, SMS, Email)',
          upside: 'A slowdown in third-party email providers (SendGrid) does not stall urgent SMS OTP sends.',
          downside: 'More queue brokers and partition management.'
        }
      ],
      failureModes: 'Process crash. Stateless compute; upstream gateway retries safely.'
    },

    'pref-template-svc': {
      id: 'pref-template-svc',
      name: 'Preferences & Templating Engine',
      tier: 'Stateless Compute',
      tierBadge: 'Hydration Engine',
      status: 'Stateless Microservice',
      role: 'Resolves user channel preferences, active device tokens, and renders localized mustache templates.',
      responsibilities: [
        'Check user consent and quiet-hour settings (e.g. do not send promotional SMS between 10 PM and 8 AM).',
        'Hydrate recipient device push tokens (iOS APNs device token, Android FCM registration ID).',
        'Compile localized templates (English, Spanish, French) with dynamic variables.',
        'Sanitize HTML content to prevent XSS injection in email bodies.'
      ],
      apis: [
        {
          method: 'INTERNAL GRPC',
          endpoint: 'TemplateService.render(templateId, locale, params)',
          description: 'Hydrate template with parameters',
          sample: 'Rendered: "Hello Alex, your order #12345 has shipped!"'
        }
      ],
      storageDecisions: [
        {
          type: 'Template Cache',
          decision: 'Redis / Local memory LRU cache with 10-minute TTL',
          rationale: 'Avoids database queries for static template structures.'
        }
      ],
      tradeoffs: [
        {
          question: 'Render templates at ingest vs at worker dispatch',
          choice: 'At Ingest for Transactional; At Worker for Bulk',
          upside: 'Bulk campaigns hydrate on demand, ensuring latest user profile data is used.',
          downside: 'Higher compute load on worker fleet.'
        }
      ],
      failureModes: 'Template not found. Falls back to default English system fallback template.'
    },

    'user-db': {
      id: 'user-db',
      name: 'User Preferences & Consent DB',
      tier: 'Storage & Caching',
      tierBadge: 'Durable Registry',
      status: 'PostgreSQL / AWS Aurora',
      role: 'Authoritative data store for user contact points, active mobile device tokens, and opt-out preferences.',
      responsibilities: [
        'Store verified phone numbers, email addresses, and registered mobile push tokens.',
        'Persist opt-in / opt-out preferences by category (Marketing, Security, Orders, Social).',
        'Support GDPR Right to be Forgotten and CAN-SPAM one-click unsubscribe records.'
      ],
      apis: [
        {
          method: 'SQL QUERY',
          endpoint: 'SELECT * FROM user_notification_preferences WHERE user_id = $1',
          description: 'Fetch preferences',
          sample: 'Row: user_id="usr_99", email_opt_in=true, sms_opt_in=false, push_token="apns_token_abc"'
        }
      ],
      storageDecisions: [
        {
          type: 'Relational Schema',
          decision: 'Normalized PostgreSQL tables with read replicas',
          rationale: 'ACID compliance for legal consent records with fast index lookups.'
        }
      ],
      tradeoffs: [
        {
          question: 'Postgres vs NoSQL for preferences',
          choice: 'Postgres with Redis cache layer',
          upside: 'Transactional integrity for audit logs when users update consent.',
          downside: 'Requires read replicas to sustain 50,000 queries/sec.'
        }
      ],
      failureModes: 'DB replica lag. Handled by reading from primary when verifying critical unsubscribe events.'
    },

    'priority-queue': {
      id: 'priority-queue',
      name: 'Partitioned Message Queues',
      tier: 'Core Processing',
      tierBadge: 'Durable Streaming',
      status: 'Apache Kafka / RabbitMQ Priority Queues',
      role: 'Durable message buffer decoupling ingestion from third-party delivery network rate limits.',
      responsibilities: [
        'Buffer up to 50,000 messages/sec during flash marketing campaigns or product drops.',
        'Segregate traffic into distinct priority topics (`high-priority-otp` vs `bulk-marketing`).',
        'Ensure critical OTP messages are consumed in < 100ms without queuing behind 10M marketing emails.',
        'Persist messages with 7-day retention for replay and worker disaster recovery.'
      ],
      apis: [
        {
          method: 'KAFKA PROTOCOL',
          endpoint: 'Topic: notif.sms.high, notif.email.bulk',
          description: 'Binary event streaming protocol',
          sample: 'Partition key: "usr_9981", Offset: 849102'
        }
      ],
      storageDecisions: [
        {
          type: 'Retention Policy',
          decision: '7-day append-only log with replication factor 3',
          rationale: 'Guarantees zero message loss even if multiple broker disks fail.'
        }
      ],
      tradeoffs: [
        {
          question: 'Single FIFO queue vs Dedicated Priority Queues',
          choice: 'Dedicated Priority Queues',
          upside: 'Completely eliminates starvation; OTP alerts are never delayed by marketing campaigns.',
          downside: 'Slightly higher queue infrastructure management overhead.'
        }
      ],
      failureModes: 'Broker partition leader failure. Kafka zookeeper/kraft auto-elects in-sync replica in < 2 seconds.'
    },

    'push-worker': {
      id: 'push-worker',
      name: 'Push Notification Workers',
      tier: 'Channel Workers',
      tierBadge: 'Mobile Push Fleet',
      status: 'Stateless Consumer Fleet',
      role: 'Consumes push notification jobs and interfaces with Apple APNs (HTTP/2) and Google FCM (HTTP v1).',
      responsibilities: [
        'Maintain persistent HTTP/2 connection pools to Apple Push Notification Service (APNs).',
        'Send batch payloads to Firebase Cloud Messaging (FCM) using OAuth2 tokens.',
        'Handle `BadDeviceToken` and `Unregistered` feedback to prune invalid tokens from user DB.',
        'Rate-limit outbound requests to respect vendor connection throttling policies.'
      ],
      apis: [
        {
          method: 'HTTP/2 POST',
          endpoint: 'https://api.push.apple.com/3/device/{device_token}',
          description: 'Apple APNs Dispatch',
          sample: 'Headers: apns-priority: 10, apns-push-type: alert\nBody: { "aps": { "alert": "Order delivered!" } }'
        }
      ],
      storageDecisions: [
        {
          type: 'Token Blacklist',
          decision: 'Redis set of expired device tokens',
          rationale: 'Fast O(1) check preventing repeat dispatch to uninstalled app tokens.'
        }
      ],
      tradeoffs: [
        {
          question: 'Maintain raw APNs connections vs Firebase wrapper',
          choice: 'Direct APNs + FCM SDKs',
          upside: 'Lowest possible latency (saves 150ms third-party intermediary hop).',
          downside: 'Must manage Apple TLS certificates and HTTP/2 connection pooling.'
        }
      ],
      failureModes: 'APNs connection drop. Worker pool auto-reconnects with exponential backoff.'
    },

    'sms-worker': {
      id: 'sms-worker',
      name: 'SMS Notification Workers',
      tier: 'Channel Workers',
      tierBadge: 'Telco SMS Fleet',
      status: 'Stateless Consumer Fleet',
      role: 'Dispatches critical SMS and OTP messages through third-party telco aggregators (Twilio, Sinch, Infobip).',
      responsibilities: [
        'Normalize recipient phone numbers to E.164 international format (e.g. `+14155552671`).',
        'Execute multi-provider routing (Primary: Twilio, Secondary: Sinch) based on delivery rates and costs.',
        'Apply circuit breaker: if primary telco vendor experiences > 5% error rate, auto-switch to backup vendor in 500ms.',
        'Throttle throughput per country destination to comply with local carrier spam filters (e.g. US 10DLC regulations).'
      ],
      apis: [
        {
          method: 'REST POST',
          endpoint: 'https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json',
          description: 'Twilio SMS REST API',
          sample: 'To: "+14155552671", Body: "Your security code is 912840", ValidityPeriod: 60'
        }
      ],
      storageDecisions: [
        {
          type: 'Vendor Health Cache',
          decision: 'Redis rolling error rate counter with 60s sliding window',
          rationale: 'Powers automated circuit breaker failover decision.'
        }
      ],
      tradeoffs: [
        {
          question: 'Single SMS vendor vs Multi-vendor failover',
          choice: 'Multi-Vendor Active-Passive Failover',
          upside: 'Shields login/signup conversions from regional telco outages.',
          downside: 'Must negotiate contracts and maintain SDK adapters for multiple providers.'
        }
      ],
      failureModes: 'Carrier route degradation. Circuit breaker shifts traffic to alternative carrier.'
    },

    'email-worker': {
      id: 'email-worker',
      name: 'Email Notification Workers',
      tier: 'Channel Workers',
      tierBadge: 'Email Fleet',
      status: 'Stateless Consumer Fleet',
      role: 'Streams bulk and transactional emails through SMTP/REST providers (SendGrid, AWS SES, Mailgun).',
      responsibilities: [
        'Sign emails with DKIM (DomainKeys Identified Mail) and verify SPF/DMARC compliance.',
        'Enforce ISP rate limits (e.g. max 50 emails/sec to Gmail MX servers) to protect domain reputation.',
        'Filter suppression list (hard bounces, spam complaints) before calling provider API.',
        'Embed tracking pixels and personalized unsubscribe URLs in compliance with RFC 8058.'
      ],
      apis: [
        {
          method: 'REST POST',
          endpoint: 'https://api.sendgrid.com/v3/mail/send',
          description: 'SendGrid Email API',
          sample: 'From: "support@company.com", To: "user@example.com", Subject: "Invoice #123"'
        }
      ],
      storageDecisions: [
        {
          type: 'Suppression Cache',
          decision: 'Bloom filter in Redis for suppressed email addresses',
          rationale: 'Instantly rejects sending to known hard-bounces with zero DB queries.'
        }
      ],
      tradeoffs: [
        {
          question: 'Self-hosted Postfix/Haraka vs Cloud Email Provider (SES/SendGrid)',
          choice: 'Managed Cloud Provider (AWS SES / SendGrid)',
          upside: 'Offloads complex ISP IP reputation warming and spam filter relationships.',
          downside: 'Slightly higher cost per thousand emails at massive scale.'
        }
      ],
      failureModes: 'Provider quota exceeded. Worker auto-backs off and pauses queue consumption.'
    },

    'dlq': {
      id: 'dlq',
      name: 'Dead-Letter Queue (DLQ)',
      tier: 'Core Processing',
      tierBadge: 'Error Isolation',
      status: 'Durable Quarantine Queue',
      role: 'Buffers poison messages, invalid payloads, and notifications that exceeded all retry attempts.',
      responsibilities: [
        'Quarantine messages that failed 3-5 consecutive delivery attempts.',
        'Store failure metadata (original payload, attempt timestamps, provider error codes).',
        'Prevent poison messages from repeatedly blocking consumer worker threads.',
        'Expose admin replay tool for operators to re-inject messages after downstream bug is fixed.'
      ],
      apis: [
        {
          method: 'AMQP / KAFKA',
          endpoint: 'Queue: notif.dlq.quarantine',
          description: 'Dead letter topic storage',
          sample: '{\n  "notificationId": "ntf_99881",\n  "failedReason": "INVALID_PHONE_NUMBER_FORMAT",\n  "attempts": 5\n}'
        }
      ],
      storageDecisions: [
        {
          type: 'Extended Retention',
          decision: '14-day persistent message retention',
          rationale: 'Gives on-call engineers two weeks to diagnose and replay failed batches.'
        }
      ],
      tradeoffs: [
        {
          question: 'Drop failed messages vs Route to DLQ',
          choice: 'Always Route to DLQ',
          upside: 'Zero silent data loss; full forensic auditability for missing customer communications.',
          downside: 'Requires queue storage and on-call alerting when DLQ size spikes.'
        }
      ],
      failureModes: 'DLQ full. Configured with disk alarm and secondary S3 archival dump.'
    },

    'webhook-ingress': {
      id: 'webhook-ingress',
      name: 'Webhook Status Ingress',
      tier: 'Delivery Feedback',
      tierBadge: 'Callback Ingress',
      status: 'Stateless Reverse Proxy Fleet',
      role: 'Receives delivery status notifications, delivery receipts (DLR), bounces, and click events from vendors.',
      responsibilities: [
        'Verify cryptographic webhook signatures (HMAC SHA-256) from Twilio, SendGrid, and Apple.',
        'Normalize disparate vendor callback formats into a standard internal `DeliveryEvent` schema.',
        'Stream status events to audit database to transition notifications from `ACCEPTED` to `DELIVERED`.',
        'Trigger automated unsubscribe workflows when spam complaints or hard bounces occur.'
      ],
      apis: [
        {
          method: 'POST',
          endpoint: '/webhooks/v1/twilio/status',
          description: 'Twilio Delivery Status Webhook',
          sample: 'Payload: MessageSid=SM123, MessageStatus="delivered", ErrorCode=null'
        }
      ],
      storageDecisions: [
        {
          type: 'HMAC Secret Store',
          decision: 'In-memory secret cache with AWS Secrets Manager sync',
          rationale: 'Enables sub-millisecond cryptographic signature verification.'
        }
      ],
      tradeoffs: [
        {
          question: 'Synchronous DB update vs Async event stream for webhooks',
          choice: 'Async Stream to Kafka then DB',
          upside: 'Survives webhook floods from vendors after a million-email campaign without DB locks.',
          downside: 'Delivery status in dashboard lags real time by 1-2 seconds.'
        }
      ],
      failureModes: 'Webhook flood. Gateway absorbs traffic and enqueues to Kafka topic.'
    },

    'delivery-db': {
      id: 'delivery-db',
      name: 'Delivery Audit & Analytics DB',
      tier: 'Delivery Feedback',
      tierBadge: 'Audit & Query Store',
      status: 'ClickHouse / Cassandra / PostgreSQL',
      role: 'Stores end-to-end delivery lifecycle logs, customer delivery history, and vendor performance analytics.',
      responsibilities: [
        'Store historical record of every notification (Sent, Delivered, Failed, Bounced, Opened).',
        'Support customer support queries: "Did user X receive their password reset SMS at 3:15 PM?".',
        'Compute vendor delivery success rates (e.g. Twilio: 98.4%, Sinch: 97.9%) to guide routing algorithms.',
        'Retain audit logs for 7 years to meet financial compliance regulations (SOX, PCI-DSS).'
      ],
      apis: [
        {
          method: 'SQL QUERY',
          endpoint: 'SELECT * FROM notification_delivery_log WHERE recipient_id = $1 ORDER BY created_at DESC LIMIT 50',
          description: 'Audit history lookup',
          sample: 'Status: DELIVERED, Provider: Twilio, LatencyMs: 412, Timestamp: 1728732001'
        }
      ],
      storageDecisions: [
        {
          type: 'Partitioned Log',
          decision: 'TimescaleDB / ClickHouse partitioned by month and tenant',
          rationale: 'Fast columnar analytics over billions of historical notification receipts.'
        }
      ],
      tradeoffs: [
        {
          question: 'Single relational DB vs Columnar OLAP',
          choice: 'Columnar Store with Hot Operational Index',
          upside: 'Runs aggregate delivery analytics across 500M rows in milliseconds without slowing write throughput.',
          downside: 'Eventually consistent updates.'
        }
      ],
      failureModes: 'Storage disk full. Automatic cold storage tiering to Amazon S3 Glacier.'
    }
  },

  // System-level Architectural Trade-offs
  tradeoffs: [
    {
      id: 'to-queuing',
      decision: 'Priority Queues vs Single Shared FIFO Queue',
      optionA: {
        name: 'Dedicated Priority Queues (Selected Default)',
        pros: 'Critical alerts (2FA OTP, fraud triggers) bypass marketing campaign queues; zero head-of-line blocking.',
        cons: 'Requires separate queue infrastructure, monitoring, and worker scaling policies per priority tier.'
      },
      optionB: {
        name: 'Single Shared FIFO Queue',
        pros: 'Simpler architecture with only one queue broker to manage and monitor.',
        cons: 'A 5-million marketing campaign will trap urgent OTPs behind it, causing severe user-facing login timeouts.'
      },
      verdict: 'Recommended: Dedicated Priority Queues. Transactional security messages must have isolated throughput and sub-second SLAs.',
      relatedNodes: ['notif-svc', 'priority-queue', 'sms-worker']
    },
    {
      id: 'to-workers',
      decision: 'Channel Worker Pull (Consumers) vs Broker Push (Direct Dispatch)',
      optionA: {
        name: 'Worker Pull Model (Selected Default)',
        pros: 'Workers control their consumption rate; naturally throttles outbound traffic to match third-party vendor rate caps.',
        cons: 'Requires managing stateless worker fleets and consumer group rebalances.'
      },
      optionB: {
        name: 'Broker Push Model',
        pros: 'Slightly lower initial latency when queue is empty.',
        cons: 'Can overwhelm third-party providers during sudden spikes, triggering rate limit bans and HTTP 429 drops.'
      },
      verdict: 'Recommended: Worker Pull Model. Protects vendor rate quotas and domain sender reputations from burst overloads.',
      relatedNodes: ['priority-queue', 'push-worker', 'sms-worker', 'email-worker']
    },
    {
      id: 'to-provider-failover',
      decision: 'Multi-Vendor Active-Passive Failover vs Single Vendor Binding',
      optionA: {
        name: 'Multi-Vendor Active-Passive with Circuit Breakers (Selected Default)',
        pros: 'Auto-shifts traffic to backup vendor (e.g. Twilio to Sinch) when primary vendor suffers an outage; protects revenue.',
        cons: 'Requires maintaining multiple vendor contracts, credentials, and API abstraction adapters.'
      },
      optionB: {
        name: 'Single Vendor Exclusive Binding',
        pros: 'Higher volume discounts with one vendor; simpler integration code.',
        cons: 'A single telco outage completely paralyzes company login and customer communications.'
      },
      verdict: 'Recommended: Multi-Vendor Failover for critical channels (SMS & Email). Circuit breaker trips on > 5% error rate.',
      relatedNodes: ['sms-worker', 'email-worker', 'dlq']
    },
    {
      id: 'to-delivery-guarantees',
      decision: 'At-Least-Once Delivery with Idempotency vs Exactly-Once',
      optionA: {
        name: 'At-Least-Once + Idempotency Keys (Selected Default)',
        pros: 'Guarantees messages are never lost during worker crashes; eliminates duplicates at ingest and provider dispatch.',
        cons: 'Telco carriers may rarely deliver duplicate SMS if carrier-level ACK packets drop over cellular networks.'
      },
      optionB: {
        name: 'Pure Exactly-Once Illusion',
        pros: 'Theoretical ideal of never sending duplicate notifications.',
        cons: 'Mathematically impossible across external third-party telco networks and cell towers.'
      },
      verdict: 'Recommended: At-Least-Once with Idempotency. Use 24-hour deduplication keys at gateway and pass provider idempotency tokens.',
      relatedNodes: ['producers', 'api-gateway', 'notif-svc', 'delivery-db']
    }
  ]
};
