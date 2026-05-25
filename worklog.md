---
Task ID: 1
Agent: Main Agent
Task: Fix test generation failing on Vercel deployment

Work Log:
- Diagnosed the root cause: z-ai-web-dev-sdk requires /etc/.z-ai-config file and internal network AI service (172.25.136.193:8080), neither available on Vercel
- Also found that `output: "standalone"` in next.config.ts is incompatible with Vercel deployment
- Created pre-generated question pool (78 questions across 8 sections) in src/lib/pre-generated-questions.json
- Created pre-generated study content for all 8 sections in src/lib/pre-generated-study.json
- Rewrote /api/generate-questions/route.ts with LLM-first, pre-generated fallback approach
- Rewrote /api/generate-study/route.ts with pre-generated content returned immediately
- Added 12-second timeout on all LLM calls for fast fallback on Vercel
- Removed `output: "standalone"` from next.config.ts for Vercel compatibility
- Updated StudySectionView with better enhancement state handling
- Tested all APIs locally - study loads in 90ms, questions fall back in ~12 seconds
- Committed and pushed to GitHub

Stage Summary:
- App now works on Vercel without any dependency on z-ai-web-dev-sdk
- Study mode loads instantly with comprehensive pre-generated content
- Test generation falls back to pre-generated questions when LLM unavailable
- When running in sandbox, LLM generation still works and provides fresh questions
- next.config.ts fixed for Vercel compatibility
