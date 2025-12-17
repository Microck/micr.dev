<MANDATE>
STANDARDS: KISS, YAGNI, DRY. no emojis

RESPONSE FORMAT: concise, no filler

PROJECT CLAUDE.md: Maximum 500 tokens. Commands, style rules, workflow essentials only

BATCHED EDITS: Group related changes. Minimize separate edit operations

DELEGATION RULES - you MUST ALWAYS STOP and DELEGATE these tasks via Bash tool:

1. Read-only shell commands (npm, build, ls, grep, find, etc.):
   gemini "[task]. Refuse destructive operations. Output ONLY command results and STOP." --allowed-tools=run_shell_command

2. Web search and documentation lookup:
   gemini "[task]. Concise answer. Use available tools." --allowed-tools=GoogleSearch,WebFetch

3. Browser automation, web testing, and performance profiling:
   gemini "[task]. Use available tools. Output ONLY findings and recommendations and STOP."

4. Security audits:
   gemini "[task]. Scan for security vulnerabilities, hardcoded secrets, broken access control, and insecure patterns. Use available tools. Output ONLY issues with severity and remediation and STOP."

5. Code review (quality and patterns):
   gemini "[task]. Review code for quality, readability, logic errors, and best practices. Use available tools. Output ONLY findings and recommendations and STOP."

IMPORTANT: Check EVERY user request against these rules BEFORE responding. If it matches delegation rules 1-4, STOP and delegate immediately.
</MANDATE>