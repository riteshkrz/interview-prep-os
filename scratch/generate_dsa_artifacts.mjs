import fs from 'fs';
import { RAW_DSA_TABLE, getCategoryFromPattern } from './build_100_dsa.mjs';

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

// 1. Generate update_100_dsa_problems.sql
let sql = `-- =============================================================================
-- 45-Day Interview Prep OS: 100 Curated Production DSA Problems
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =============================================================================

-- 1. Ensure description and link columns exist in dsa_problems table
ALTER TABLE public.dsa_problems 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.dsa_problems 
ADD COLUMN IF NOT EXISTS link TEXT;

-- 2. Remove previous DSA questions
DELETE FROM public.dsa_problems;

-- 3. Insert the 100 Curated Production DSA Problems
INSERT INTO public.dsa_problems (
    id, 
    title, 
    description, 
    pattern, 
    difficulty, 
    category, 
    link, 
    revision_timing, 
    est_time_minutes, 
    order_index
)
VALUES
`;

const sqlValues = RAW_DSA_TABLE.map((p, idx) => {
  const id = `dsa-${p.order}`;
  const category = getCategoryFromPattern(p.pattern, p.order);
  const estTime = p.difficulty === 'Easy' ? 15 : p.difficulty === 'Hard' ? 35 : 25;
  const revision = p.order <= 14 ? 'In 14 days' : p.order <= 30 ? 'In 7 days' : p.order <= 60 ? 'In 10 days' : 'In 5 days';

  return `(
    ${escapeSql(id)},
    ${escapeSql(p.title)},
    ${escapeSql(p.description)},
    ${escapeSql(p.pattern)},
    ${escapeSql(p.difficulty)},
    ${escapeSql(category)},
    ${escapeSql(p.link)},
    ${escapeSql(revision)},
    ${estTime},
    ${p.order}
)`;
}).join(',\n');

sql += sqlValues;
sql += `
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    pattern = EXCLUDED.pattern,
    difficulty = EXCLUDED.difficulty,
    category = EXCLUDED.category,
    link = EXCLUDED.link,
    revision_timing = EXCLUDED.revision_timing,
    est_time_minutes = EXCLUDED.est_time_minutes,
    order_index = EXCLUDED.order_index,
    updated_at = timezone('utc'::text, now());
`;

fs.writeFileSync('./supabase/update_100_dsa_problems.sql', sql, 'utf8');
console.log('Wrote ./supabase/update_100_dsa_problems.sql');

// 2. Build JavaScript objects for seedCatalog.js
const dsaCatalogItems = RAW_DSA_TABLE.map(p => {
  const category = getCategoryFromPattern(p.pattern, p.order);
  const estTime = p.difficulty === 'Easy' ? '15m' : p.difficulty === 'Hard' ? '35m' : '25m';
  const revision = p.order <= 14 ? 'In 14 days' : p.order <= 30 ? 'In 7 days' : p.order <= 60 ? 'In 10 days' : 'In 5 days';

  return {
    id: `dsa-${p.order}`,
    title: p.title,
    description: p.description,
    pattern: p.pattern,
    difficulty: p.difficulty,
    category: category,
    link: p.link,
    revision: revision,
    timeSpent: estTime,
    status: 'Queued',
    confidence: 0
  };
});

// Update src/data/seedCatalog.js
const seedCatalogPath = './src/data/seedCatalog.js';
const seedCatalogContent = fs.readFileSync(seedCatalogPath, 'utf8');
const dsaMarker = 'export const SEED_DSA_PROBLEMS = [';
const dsaIndex = seedCatalogContent.indexOf(dsaMarker);

if (dsaIndex === -1) {
  throw new Error('Could not find SEED_DSA_PROBLEMS in seedCatalog.js');
}

const beforeDsa = seedCatalogContent.slice(0, dsaIndex);
const newSeedCatalogContent = beforeDsa + dsaMarker + '\n' + dsaCatalogItems.map(item => '  ' + JSON.stringify(item, null, 2).replace(/\n/g, '\n  ')).join(',\n') + '\n];\n';

fs.writeFileSync(seedCatalogPath, newSeedCatalogContent, 'utf8');
console.log('Updated ./src/data/seedCatalog.js');

// 3. Update supabase/seed_questions.sql
const seedQuestionsPath = './supabase/seed_questions.sql';
let seedQuestionsContent = fs.readFileSync(seedQuestionsPath, 'utf8');

// Ensure table definition has description and link
const tableOld = `CREATE TABLE IF NOT EXISTS public.dsa_problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    pattern TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    category TEXT NOT NULL,
    revision_timing TEXT DEFAULT 'In 7 days',
    est_time_minutes INTEGER DEFAULT 30,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);`;

const tableNew = `CREATE TABLE IF NOT EXISTS public.dsa_problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    pattern TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    category TEXT NOT NULL,
    link TEXT,
    revision_timing TEXT DEFAULT 'In 7 days',
    est_time_minutes INTEGER DEFAULT 30,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);`;

if (seedQuestionsContent.includes(tableOld)) {
  seedQuestionsContent = seedQuestionsContent.replace(tableOld, tableNew);
}

// Replace the DSA insert section in seed_questions.sql
const dsaInsertMarker = 'INSERT INTO public.dsa_problems (id, title, pattern, difficulty, category, revision_timing, est_time_minutes, order_index)';
const dsaInsertIndex = seedQuestionsContent.indexOf(dsaInsertMarker);

if (dsaInsertIndex !== -1) {
  const dsaInsertEndMarker = '-- =============================================================================\n-- HELPER QUERIES: How to Insert & Manage Questions Manually in Supabase';
  const dsaInsertEndIndex = seedQuestionsContent.indexOf(dsaInsertEndMarker);

  const newDsaInsertSection = `INSERT INTO public.dsa_problems (
    id, title, description, pattern, difficulty, category, link, revision_timing, est_time_minutes, order_index
)
VALUES
` + sqlValues + `
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    pattern = EXCLUDED.pattern,
    difficulty = EXCLUDED.difficulty,
    category = EXCLUDED.category,
    link = EXCLUDED.link,
    revision_timing = EXCLUDED.revision_timing,
    est_time_minutes = EXCLUDED.est_time_minutes,
    order_index = EXCLUDED.order_index,
    updated_at = timezone('utc'::text, now());\n\n`;

  seedQuestionsContent = seedQuestionsContent.slice(0, dsaInsertIndex) + newDsaInsertSection + seedQuestionsContent.slice(dsaInsertEndIndex);
  fs.writeFileSync(seedQuestionsPath, seedQuestionsContent, 'utf8');
  console.log('Updated ./supabase/seed_questions.sql');
} else {
  console.log('Notice: dsaInsertMarker not matched directly, checking alternative format in seed_questions.sql');
}
