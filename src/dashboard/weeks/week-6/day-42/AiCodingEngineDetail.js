/**
 * AI Coding Engines: AlphaCode (Topic 9.7)
 * Source: The System Design Interview Guide (Senior & Staff Engineer Edition), Pages 128–130
 */

export function renderAiCodingEngineContent() {
  return `
<div class="modern-guide-spec" data-visual-guide="ai-coding-engine">
  <div class="space-y-8 text-slate-300">
    <!-- Header Summary Card -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A] shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Book Topic 9.7 · Pages 128–130
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
            Applied Generative AI Architecture
          </span>
        </div>
        <span class="text-xs font-sans text-slate-400 font-medium">Generate-and-Filter Funnel · Behavioral Clustering · Firecracker Sandboxes</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">AI Coding Engines: AlphaCode & LLM Inference Pipelines</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        AlphaCode (DeepMind) established that AI competitive programming is not merely an ML model prompt problem — it is an end-to-end distributed systems challenge: <strong>massive parallel generation followed by an aggressive hierarchical verification funnel</strong>. Serving generated code at scale requires isolating untrusted code in microVM sandboxes and clustering candidates by execution behavior rather than text syntax.
      </p>
    </div>

    <!-- The Generate-and-Filter Funnel Diagram (Page 128) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        The Generate-and-Filter Funnel (Page 128)
      </h3>
      <div class="p-4 rounded-xl bg-[#0A0E17] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
<pre>
   GitHub Code Repo ──► PRE-TRAIN Transformer
                               │
   Competitive Dataset ──► FINE-TUNE on task-specific programming challenges
                               │
                               ▼
        GENERATE: Massive Parallel Inference (Millions of Candidate Programs)
                               │
                               ▼
        CHEAP FILTER: Discard programs that fail syntax compilation or sample tests (Drops 95%)
                               │
                               ▼
        BEHAVIORAL CLUSTERING: Group candidates by runtime output signature on synthetic tests
                               │ (Deduplicate by identical execution OUTPUT, not by source text!)
                               ▼
        RERANKING & EVALUATION: Select &le;10 diverse representative programs
                               │
                               ▼
        FINAL SUBMISSION: Best verified program selected for scoring
</pre>
      </div>
    </div>

    <!-- The 2-Tier Production Serving Architecture (Page 129) -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
        Production Serving Architecture: The Two-Tier Cluster (Page 129)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-purple-300 font-bold mb-2">TIER 1: GPU INFERENCE FLEET</div>
          <ul class="space-y-1.5 text-slate-300 font-sans list-disc list-inside">
            <li><strong>Workload:</strong> Generates code candidates via transformer sampling.</li>
            <li><strong>Batching:</strong> Continuous dynamic batching (vLLM / TensorRT-LLM) to maximize GPU Tensor Core utilization.</li>
            <li><strong>Autoscaling:</strong> Scaled on queue depth and request token length rather than CPU percent.</li>
          </ul>
        </div>

        <div class="p-4 rounded-xl bg-[#141C2E] border border-slate-800">
          <div class="text-emerald-300 font-bold mb-2">TIER 2: SANDBOXED EXECUTION FLEET</div>
          <ul class="space-y-1.5 text-slate-300 font-sans list-disc list-inside">
            <li><strong>Workload:</strong> Compiles and executes untrusted code candidates against test inputs.</li>
            <li><strong>Security Isolation:</strong> Firecracker MicroVMs or gVisor containers with strict CPU, memory, and timeout bounds (2 seconds max).</li>
            <li><strong>Zero Network Access:</strong> Loopback disabled; no outbound internet access to prevent reverse shells and cloud credential theft.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Behavioral Clustering Drill -->
    <div class="p-6 rounded-2xl bg-[#0F1626] border border-[#24314A]">
      <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        Behavioral Clustering: Deduplicating by Output, Not Text (Page 128)
      </h3>
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2 leading-relaxed">
        <p class="text-slate-300">
          When an LLM generates 100,000 code snippets for a problem, thousands are syntactically different (different variable names, loops vs recursion) but <strong>algorithmically identical</strong>.
        </p>
        <p class="text-cyan-200 font-mono">
          Feed synthetic inputs &rarr; Capture vector of outputs: [Output_1, Output_2, ... Output_K]
        </p>
        <p class="text-slate-400 text-[11.5px]">
          Programs yielding the exact same output vector belong to the same behavioral cluster. The reranker picks <strong>one representative per cluster</strong>, guaranteeing maximum algorithmic diversity among the 10 final submissions!
        </p>
      </div>
    </div>

    <!-- Key Takeaway Banner -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-[#0F1626] to-cyan-900/30 border border-emerald-500/30">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎯</span>
        <div>
          <h4 class="font-bold text-white text-sm">Key Interview Takeaway (Page 130)</h4>
          <p class="text-emerald-200/90 text-xs mt-0.5 leading-relaxed">
            "AlphaCode's architecture is generate broadly, verify cheaply, cluster behaviourally, and rerank narrowly. Isolate the GPU generation tier from the CPU verification tier, run untrusted generated code inside strict Firecracker microVM sandboxes, and deduplicate candidates by runtime execution signatures rather than AST code similarity."
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}
