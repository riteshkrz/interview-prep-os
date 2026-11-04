/**
 * Question 19. Design a cloud file storage service like Dropbox
 * System Design Interview Masterclass — Module 4: Business-critical systems (Pages 83–86)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderCloudFileStorageDetail() {
  return renderMasterclassQuestion({
    questionNumber: 19,
    title: "Design a cloud file storage service like Dropbox",
    moduleName: "Module 4 — Business-critical systems",
    coreTopics: "object storage, chunked uploads, sync cursors, versioning, conflict resolution, and access control",

    problemStatement: `Design a cloud file storage service where users upload files, arrange folders, sync changes across devices, share content, and restore earlier versions.`,

    clarifyingQuestions: [
      { q: "Is the product backup-focused or built for collaborative editing?", a: "In scope: storing files, keeping devices in sync, sharing, and revision history; collaborative live editing is excluded." },
      { q: "What file size range must we handle?", a: "From small documents through large objects, with resumable uploads." },
      { q: "How should simultaneous edits be handled?", a: "Surface conflicts and retain both sides; automatic merging of arbitrary binary files is not required." },
      { q: "Is private sharing in scope?", a: "Supported, provided permissions are explicit and share links can be revoked." }
    ],

    functionalRequirements: [
      "Users can upload, download, rename, and remove files.",
      "Place files in folder hierarchies.",
      "Propagate changes across devices.",
      "Grant file access to users who are authorized.",
      "Retain version history.",
      "Resume large uploads after interruption.",
      "Spot concurrent modifications."
    ],

    nonFunctionalRequirements: [
      "Strong durability and availability.",
      "Strict access control.",
      "Metadata and blob storage that scale.",
      "Efficient use of bandwidth.",
      "Dependable synchronization.",
      "Recovery from broken transfers and offline clients."
    ],

    apiDesign: `POST /api/v1/uploads
// Initiates resumable chunk session

POST /api/v1/files/{fileId}/versions
// Commits newly uploaded chunks as next version pointer

GET /api/v1/files/{fileId}
// Returns metadata and short-lived signed S3 download URL

GET /api/v1/sync?cursor=eyJzZXFfaWQiOiAxMjA0fQ==
// Delta sync: returns changes made since client's cursor

POST /api/v1/files/{fileId}/shares
// Generates access token with read/write permission and expiry

DELETE /api/v1/files/{fileId}`,

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">Dropbox Entities &amp; Schemas</span>
FileMetadata:
  file_id, owner_id, path, current_version_id, size, content_hash, updated_at, deleted_at

FileVersion:
  version_id, file_id, object_key, content_hash, size, created_at

SharePermission:
  file_id, principal_id, permission (READ / EDIT), expires_at
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Raw file bytes live in object storage (S3/GCS); metadata, folder hierarchies, and version pointers live in a distributed database.
        </p>
      </div>
    `,

    highLevelArchitecture: `Sync path: Client sync agent &rarr; sync API &rarr; metadata and permission service &rarr; metadata database/change log.<br/><br/>
    Clients receive signed upload and download URLs and move bytes directly to object storage. Change events wake other devices, while a durable sync cursor lets them catch up after downtime.`,

    architectureImage: '/images/hld/q19_cloud_file_storage_architecture.svg',
    architectureImageTitle: 'Design Cloud File Storage (Dropbox / S3) — Chunking, Deduplication & Block Storage Architecture',

    architectureDiagram: `[Client Device A] ──(Detects File Change)
       │ (1. Chunk file & hash: 4MB blocks)
       ├──(2. Direct Block Upload)────────► [Object Store (S3)]
       │
       ▼ (3. Commit New Version)
[Sync API Gateway] ──► [Metadata Service] ──► [Metadata DB & Change Log]
                            │
                            ▼ (Publish FileModified Event)
                     [Notification Gateway]
                            │
                            ▼ (Push hint to wake device)
                    [Client Device B] ──(4. GET /sync?cursor=X)──► [Download Delta]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Mirror what changed locally versus on the server",
        stepBody: "Each client keeps local file IDs, hashes, versions, and its last sync cursor. After reconnect, it pulls remote changes since that cursor."
      },
      {
        stepNumber: 2,
        stepTitle: "Push file deltas and new blobs upstream",
        stepBody: "Small files upload in one shot. Large files use multipart or chunked uploads (e.g. 4MB blocks) with checksums so partial failures can be retried."
      },
      {
        stepNumber: 3,
        stepTitle: "Record updated metadata in the authoritative store",
        stepBody: "Once content is safely stored, create a new file version and advance the current-version pointer under a conditional version check. Never expose a version whose upload is incomplete."
      },
      {
        stepNumber: 4,
        stepTitle: "Push notifications so other clients pull changes",
        stepBody: "Append a durable change record and emit a notification. Devices use notifications as hints to fetch updates, but the change log remains source of truth because notifications can drop."
      },
      {
        stepNumber: 5,
        stepTitle: "Spot edits that happened on multiple devices at once",
        stepBody: "When two devices edit from the same base version, version checks expose the conflict. For generic binary blobs, keep both revisions or add a conflict copy (e.g. <code>MyFile (Conflicted Copy).docx</code>) rather than overwriting silently."
      },
      {
        stepNumber: 6,
        stepTitle: "Handle tombstones and restoring deleted items",
        stepBody: "Record tombstones so offline clients learn about deletes. Run garbage collection only when no retained or restorable version still references the content."
      },
      {
        stepNumber: 7,
        stepTitle: "Enforce access control on shared files",
        stepBody: "Check permissions on metadata and blob access. Share links need scoped rights, revocation, and optional expiry. Prefer short-lived signed download URLs."
      }
    ],

    whyComponents: [
      { component: "Metadata service", why: "Owns ownership, folder layout, and version pointers" },
      { component: "Object storage", why: "Holds large file payloads durably with 11 9s durability" },
      { component: "Chunked upload manager", why: "Enables resume and checksum validation for multi-GB transfers" },
      { component: "Change log", why: "Powers reliable sync after disconnects via sequential cursors" },
      { component: "Sync agent", why: "Aligns on-disk filesystem state with the remote catalog" },
      { component: "Permission service", why: "Enforces file and shared-link access policies" },
      { component: "Garbage collector", why: "Removes unreferenced orphaned blocks safely" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Chunking:</strong> Makes large transfers resilient to network blips, but adds metadata tracking and assembly overhead.",
      "<strong>Content-addressed deduplication:</strong> Saves massive cloud storage space, but raises side-channel privacy and cross-user data leakage concerns.",
      "<strong>Event notifications:</strong> Cut sync latency, but cannot substitute for a durable change log since push notifications can drop.",
      "<strong>Optimistic concurrency:</strong> Enables full offline editing on planes and trains, but demands clear conflict copy resolution strategies.",
      "<strong>Unlimited file versions:</strong> Aids accidental deletion recovery, but significantly drives up long-term storage spend without tiering."
    ],

    followUps: [
      {
        q: "A laptop was disconnected for a week—how does it get current again?",
        a: "“It pulls deltas from its last sync cursor and merges them with authoritative metadata. Outbound local edits are checked against versions, and clashes are kept visible (creating conflict copies) instead of being overwritten quietly.”"
      },
      {
        q: "What tactics lower storage spend?",
        a: "“Apply lifecycle storage tiers (S3 Standard &rarr; Infrequent Access &rarr; Glacier), compress suitable file types, enforce retention policies, and deduplicate where it pays off. Weigh deduplication against privacy leakage and operational complexity.”"
      },
      {
        q: "If the blob upload succeeds but committing metadata fails, how do you fix it?",
        a: "“Leave the upload unreferenced until finalization, retry the metadata commit idempotently, and purge abandoned multipart uploads or orphan objects under a safe periodic retention policy.”"
      }
    ]
  });
}
