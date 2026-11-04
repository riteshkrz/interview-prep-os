/**
 * Question 15. Design a distributed task scheduler
 * System Design Interview Masterclass — Module 3: Data-intensive systems (Pages 67–70)
 */

import { renderMasterclassQuestion } from '../../common/MasterclassTemplate.js';

export function renderDistributedTaskSchedulerDetail() {
  return renderMasterclassQuestion({
    questionNumber: 15,
    title: "Design a distributed task scheduler",
    moduleName: "Module 3 — Data-intensive systems",
    coreTopics: "durable scheduling, leases, queues, retries, recurring tasks, and idempotent execution",

    problemStatement: `Design a service that fires tasks at a scheduled instant or on a recurring cadence, hands off due work to workers, retries on failure, and retains an execution audit trail.`,

    clarifyingQuestions: [
      { q: "Which scheduling modes are in scope?", a: "Both one-shot and recurring jobs." },
      { q: "How tight must timing accuracy be?", a: "Most runs should begin within a few seconds of the scheduled time." },
      { q: "What happens when a worker dies mid-run?", a: "The system should retry according to the task's configured policy." },
      { q: "Is duplicate execution acceptable?", a: "Retries may run more than once, but downstream effects should be idempotent whenever feasible." },
      { q: "Are run durations uniform?", a: "Some tasks finish in seconds; others may run for several minutes." }
    ],

    functionalRequirements: [
      "Support creating, updating, and canceling tasks.",
      "Schedule both one-time and repeating jobs.",
      "Route tasks that are due to workers with available capacity.",
      "Retry failed attempts and enforce execution timeouts.",
      "Persist current status and a history of each run.",
      "Honor priorities and concurrency caps where the product requires them."
    ],

    nonFunctionalRequirements: [
      "Schedules that survive restarts and crashes.",
      "Ability to scale out horizontally.",
      "Graceful recovery after scheduler or worker outages.",
      "Documented expectations for schedule precision.",
      "Predictable, policy-driven retries.",
      "Visibility into backlog, overdue tasks, and chronic failures."
    ],

    dataModel: `
      <div class="flex flex-col gap-3 font-mono text-[12.5px]">
        <div class="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-[#1E293B]">
          <span class="text-cyan-500 font-bold block mb-1">Task Definition &amp; Execution Schemas</span>
Task:
  task_id, schedule_expression (cron / at), next_run_at, status, attempt_count, retry_policy, lease_until, payload_reference, created_at

TaskExecution:
  execution_id, task_id, scheduled_at, started_at, finished_at, status (RUNNING / SUCCESS / FAILED), error_code
        </div>
        <p class="font-sans text-[12.5px] text-slate-500 italic">
          Keeping task definitions separate from per-run execution records simplifies history, retries, and recurring-instance tracking.
        </p>
      </div>
    `,

    highLevelArchitecture: `Job flow: Scheduler API &rarr; task database &rarr; due-task scanner or timing wheel &rarr; durable dispatch queue &rarr; worker fleet &rarr; external side effects/business services.<br/><br/>
    Workers extend leases or send heartbeats as designed. A retry component handles failures and re-queueing; a status store captures final outcomes.`,

    architectureImage: '/images/hld/q15_distributed_task_scheduler.svg',
    architectureImageTitle: 'Design a Distributed Task Scheduler — Leader Coordination & Worker Heartbeat Topology',

    architectureDiagram: `[Scheduler API] ──► [Task DB (Indexed by next_run_at)]
                           │
                           ▼ (Batch Scan / Time Buckets)
               [Due Task Scanner / Timing Wheel]
                           │
              (Lease Claim via CAS / UPDATE ... WHERE lease_until < NOW)
                           ▼
               [Durable Dispatch Queue]
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
   [Worker 1]          [Worker 2]          [Worker 3]
       │ (Heartbeat / Extend Lease)
       ▼
 [Downstream Service]
       │
       ▼ (Execution Result)
 [Status Store & Audit Trail] ──(On Failure)──► [Retry Scheduler]`,

    stepByStepDesign: [
      {
        stepNumber: 1,
        stepTitle: "Save task definitions durably",
        stepBody: "Validate schedule expression and payload reference, persist the definition, and compute or maintain the next fire time."
      },
      {
        stepNumber: 2,
        stepTitle: "Identify tasks that are due to run",
        stepBody: "For a moderate system, query an indexed <code>next_run_at</code> field in batches. For higher scale, partition by time buckets or use a timing-wheel structure for efficient near-term scheduling."
      },
      {
        stepNumber: 3,
        stepTitle: "Claim work with a safe lease",
        stepBody: "Claim each occurrence with a conditional write or time-bounded lease so concurrent schedulers cannot double-assign the same run. Expired leases let another instance take over after a crash."
      },
      {
        stepNumber: 4,
        stepTitle: "Hand off execution through a durable queue",
        stepBody: "Enqueue an execution message on a durable queue. An outbox (or similar pattern) avoids marking a run dispatched in the database when the publish never lands."
      },
      {
        stepNumber: 5,
        stepTitle: "Worker processes run the queued jobs",
        stepBody: "Workers take ownership, record start time, and invoke the handler. Enforce timeouts and heartbeat rules. Propagate a stable execution ID to downstream calls when possible."
      },
      {
        stepNumber: 6,
        stepTitle: "Failed runs are retried according to policy",
        stepBody: "Backoff exponentially with jitter. Classify transient versus permanent errors and move exhausted jobs to dead-letter or failed state."
      },
      {
        stepNumber: 7,
        stepTitle: "Configure jobs that repeat on a schedule",
        stepBody: "Compute the next run using explicit timezone and daylight-saving rules. Persist a unique occurrence identity so repeated scans cannot spawn duplicate logical runs."
      }
    ],

    whyComponents: [
      { component: "Task database", why: "Holds schedules and authoritative run state" },
      { component: "Scheduler/scanner", why: "Surfaces work that has reached its due time" },
      { component: "Lease mechanism", why: "Enables exclusive claims and safe failover" },
      { component: "Durable queue", why: "Buffers dispatch from scheduler capacity to worker capacity" },
      { component: "Worker fleet", why: "Runs tasks in parallel at scale" },
      { component: "Retry scheduler", why: "Applies backoff and tracks repeated failures" },
      { component: "Execution history", why: "Powers audits, debugging, and status APIs" }
    ],

    tradeoffType: "list",
    tradeoffs: [
      "<strong>Polling the database:</strong> Simple to implement, but creates heavy I/O polling contention at massive scale.",
      "<strong>Timing wheels:</strong> Schedules imminent near-term tasks in O(1), but still needs durable DB backing for persistence and crash recovery.",
      "<strong>At-least-once dispatch:</strong> Highly resilient to worker crashes, yet can produce duplicate execution attempts.",
      "<strong>Strong global coordination:</strong> Clarifies exact single-leader ownership, but caps scheduling throughput.",
      "<strong>Aggressive retries:</strong> Improve job success rates, but can cause thundering herds and overwhelm downstream dependencies without concurrency limits."
    ],

    followUps: [
      {
        q: "Is it possible to promise exactly-once execution?",
        a: "“Not for arbitrary external side effects. Make scheduling updates idempotent, assign stable execution IDs, and require idempotent downstream handlers. In practice aim for at-least-once dispatch with effectively-once business outcomes.”"
      },
      {
        q: "What happens when a worker stops making progress?",
        a: "“Treat missing heartbeats or an expired lease as failure and reclaim the job. Because the hung worker might still finish, use fencing tokens or downstream idempotency so stale work cannot clobber newer results.”"
      },
      {
        q: "What is your approach when one million tasks are due at once?",
        a: "“Shard dispatch, scale workers, cap per-tenant and downstream concurrency, and stagger starts when business rules allow. The scheduler must enqueue work asynchronously rather than executing everything inline.”"
      }
    ]
  });
}
