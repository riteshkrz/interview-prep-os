/**
 * Question 7. Design WhatsApp
 * System Design Interview Masterclass — Module 2: Consumer-scale applications (Pages 37–39)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderWhatsAppDetail() {
  return renderMasterclassQuestion({
    questionNumber: 7,
    title: "Design WhatsApp",
    moduleName: "Module 2 — Consumer-scale applications",
    coreTopics: "long-lived connections, offline delivery, ordering, receipts, and end-to-end encryption",

    problemStatement: `Design a messaging system that lets users exchange messages in real time, including when recipients are offline. It should provide message persistence, delivery status, and secure communication.`,

    clarifyingQuestions: [
      { q: "Should group chat be in scope?", a: "Begin with one-to-one messaging, and keep the design extensible to groups." },
      { q: "Must queued messages reach offline users eventually?", a: "Yes—store and deliver them subject to the platform retention policy." },
      { q: "Is end-to-end encryption mandatory?", a: "Yes—the backend must never see decrypted message bodies." },
      { q: "Should one account use several devices?", a: "Yes, in a later phase. Plan for device IDs and session lifecycle up front." }
    ],

    functionalRequirements: [
      "Exchange messages in both directions.",
      "Flush queued messages once the recipient comes online.",
      "Persist conversation history under defined retention limits.",
      "Surface sent, delivered, and read indicators.",
      "Support routing to the user's active connection, and queue messages while that user is offline.",
      "Carry encrypted payloads and linked devices when those features are enabled."
    ],

    nonFunctionalRequirements: [
      "Timely end-to-end message delivery.",
      "Accepted messages remain stored durably.",
      "The platform remains highly available.",
      "Predictable ordering within each conversation.",
      "Strong confidentiality and privacy guarantees.",
      "Expand connection handling and message storage horizontally."
    ],

    customSections: [
      {
        title: "Example Message Envelope",
        content: `
          <div class="flex flex-col gap-2">
            <div class="bg-[#0B0F17] border border-[#24314A] rounded-xl p-4 font-mono text-[12.5px] text-emerald-400">
{
  "messageId": "m123",
  "conversationId": "c456",
  "senderDeviceId": "device-a",
  "recipientId": "user-b",
  "encryptedPayload": "eyJhZXMiOiAiNzlmMWFkLi4uIiwgIml2IjogIjAyYWYzLi4uIn0=",
  "createdAt": "2026-10-11T12:00:00Z"
}
            </div>
            <p class="text-[12.5px] text-slate-500 italic">
              A stable client-generated message ID enables deduplication. The server can route and store encrypted payloads without having access to plaintext.
            </p>
          </div>
        `
      }
    ],

    highLevelArchitecture: `Outbound: sender device &rarr; connection gateway &rarr; message service &rarr; durable message store or log &rarr; recipient delivery router &rarr; recipient connection gateway &rarr; recipient device.<br/><br/>
    For offline recipients, the system keeps the encrypted payload and retries delivery after reconnect; presence, push notification, and receipt handling are handled elsewhere.`,

    architectureImage: '/images/hld/q07_whatsapp_architecture.svg',
    architectureImageTitle: 'Design WhatsApp — High-Level Architecture, Real-Time Messaging & Delivery Pipeline',

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Open authenticated sessions",
        stepBody: "Devices authenticate and attach to a gateway over WebSocket or another appropriate persistent-connection protocol. A session service records which gateway owns each active device connection."
      },
      {
        stepNumber: 2,
        stepTitle: "Ingest outgoing messages",
        stepBody: "The client encrypts the message. The server checks authorization and metadata, applies size limits, deduplicates on message ID, and persists the message before acknowledging acceptance."
      },
      {
        stepNumber: 3,
        stepTitle: "Attach ordering metadata",
        stepBody: "Apply conversation partitioning or per-conversation sequence metadata where needed. Ordering every message globally across the entire planet is unnecessary and costly."
      },
      {
        stepNumber: 4,
        stepTitle: "Deliver to online recipients",
        stepBody: "The delivery router finds the recipient's active connection and passes along the encrypted message. If none is available, the message stays pending under the retention policy."
      },
      {
        stepNumber: 5,
        stepTitle: "Handle delivery receipts",
        stepBody: "Separate server acceptance (single tick), device delivery (double tick), and read receipts (blue double tick). Each receipt path is idempotent, and read receipts obey user privacy settings."
      },
      {
        stepNumber: 6,
        stepTitle: "Sync after reconnect",
        stepBody: "After reconnect, the device fetches pending messages or changes since a known cursor. Deduplication matters because senders may retry and receivers may reconnect mid-delivery."
      },
      {
        stepNumber: 7,
        stepTitle: "Preserve confidentiality end to end",
        stepBody: "Adopt established end-to-end encryption protocols (e.g., Signal Protocol) and secure key management. Server-side search and content inspection are constrained when the server lacks plaintext or decryption keys."
      }
    ],

    whyComponents: [
      { component: "Connection gateways", why: "Handle large volumes of persistent client connections" },
      { component: "Message service", why: "Validates inbound traffic and persists it durably" },
      { component: "Message store", why: "Backing store for offline delivery and recovery" },
      { component: "Session/presence service", why: "Tracks which gateway currently hosts each device" },
      { component: "Push notification service", why: "Nudges offline clients but does not replace the durable message store" },
      { component: "Encryption/key infrastructure", why: "Keeps content inaccessible to unauthorized parties" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Persistent connections:</strong> Cut per-message overhead but demand careful resource and memory management (file descriptors).",
      "<strong>Durable acknowledgment:</strong> Boosts reliability and guarantees zero data loss, but can add end-to-end latency.",
      "<strong>Global ordering across partitions:</strong> Costly and unnecessary; per-conversation ordering is the practical distributed target.",
      "<strong>End-to-end encryption:</strong> Strengthens confidentiality and trust, but eliminates server-side content search, virus scanning, and server moderation.",
      "<strong>Tighter retention:</strong> Saves storage spend, but overly short windows can drop messages before offline users return from travel."
    ],

    followUps: [
      {
        q: "What if someone stays offline for three days?",
        a: "“Keep encrypted messages for the configured retention period and deliver on reconnect. When they expire, follow the defined expiration and acknowledgment policy.”"
      },
      {
        q: "How are duplicate deliveries prevented?",
        a: "“Use a stable message ID and idempotent server-side storage. Delivery attempts and acknowledgment handling must also be duplicate-safe.”"
      },
      {
        q: "Is server-side search over message text possible?",
        a: "“Not when contents are end-to-end encrypted and the server holds no decryption keys. Search runs on authorized clients or through a separately designed privacy-preserving mechanism.”"
      }
    ]
  });
}
