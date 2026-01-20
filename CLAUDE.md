# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hard rules
Step 1 - Find the actual problem, or understand the new task
Step 2 - ask clarifying questions, no assumptions about what user wants or what the current codebase has
Step 3 - read all, and i mean "all" related files from line to end
Step 4 - if it requires backend modification, work on one endpoint at once only
Step 5 - ask user to test the endpoint using postman
Step 6 - make changes to related frontend
Step 7 - ask user to test the frontend
Step 8 - if it requires backend modification, work on one endpoint at once only
and so on.

# Never try to suggest or apply a workaround
# never interact with git or github
# Never use emojis, in code or conversation
# Always build in chunks - build - test - fix - build - text and so on
# never start or stop servers or services

## Debugging and Question Handling Rules

### When investigating issues:
1. **Always investigate yourself first** using available tools (Read, Grep, Glob, Bash for API calls)
2. **Only ask the user to check something** if you need information only they can access:
   - Runtime behavior in their browser (console errors, network requests)
   - Visual issues you cannot see (layout problems, rendering issues)
   - User-specific environment issues

### If you need to ask the user something:
1. **Give complete, clear instructions**:
   - GOOD: "Press F12 to open browser console, go to Console tab, refresh the page, and tell me what errors you see"
   - BAD: "Check the console" or "Look at the data"
2. **WAIT for their response** before proceeding
3. **Don't start investigating on your own** while waiting for their answer
4. If they ask "where?" or similar clarifying questions, answer them directly and literally

### Conditional plans are NOT allowed:
1. **Don't present plans that depend on unknown information**
   - BAD: "Check console logs, then based on what's found, fix the issue"
   - GOOD: Investigate files first, identify the issue, then present a complete fix plan
2. **Gather all information first**:
   - Read backend files to see what data is returned
   - Check frontend code to see what data is expected
   - Only after understanding the full picture, present a plan
3. **Plan mode is for ready-to-execute plans**, not "if this then that" scenarios

### Communication rules:
1. **Never say "you're right"** or similar validation phrases
2. Answer user questions literally - if they ask "where", tell them the location, not what you'll do
3. When you make a mistake, acknowledge it by changing behavior, not by repeating apologies

## Design Consistency Rules

### Always check existing design patterns before creating new UI:
1. **Read these files first**:
   - Dashboard pages: `client/src/pages/student/Overview.jsx`, `client/src/pages/collegeAdmin/Overview.jsx`
   - Section components: `client/src/components/sections/TractionProofSection.jsx`, `client/src/components/sections/NetworkMapSection.jsx`
   - Card examples in dashboards to understand spacing, gradients, and animations

