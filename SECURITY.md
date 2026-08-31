# Security Policy

## Reporting a vulnerability

**Do not open a public issue.**

Report privately through [GitHub Security Advisories](https://github.com/franciscoribeiro99/TemplateReact/security/advisories/new), or email the address in `src/config/site.ts`.

Please include:

- What the vulnerability allows an attacker to do
- Steps to reproduce, or a proof of concept
- The affected version, commit, or deployed URL

You can expect an acknowledgement within 3 business days and an assessment within 10. We will keep you updated through to a fix and will credit you in the advisory unless you prefer otherwise.

## Scope

In scope: this template's source, its CI workflows, and its dependency manifest.

Out of scope: vulnerabilities in sites built from this template that stem from your own modifications, and findings from automated scanners without a demonstrated impact.

## What this template does for you

- Security headers on every response (`next.config.ts`): `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS
- `x-powered-by` removed
- All Server Action input re-validated against a Zod schema server-side
- JSON-LD escaped so embedded data cannot break out of its `<script>` tag
- Environment variables validated at startup — a missing or malformed value fails the build, not a request
- Grouped Dependabot updates, weekly
- Weekly CodeQL analysis — **runs on public repositories only**. CodeQL requires
  GitHub Advanced Security on private repos, and fails rather than skipping
  without it, so `.github/workflows/codeql.yml` gates itself on visibility.
  If your private repo has Advanced Security, remove the `if:` on the job.

## What you still have to do

- Replace the placeholder legal pages with real ones
- Add a Content-Security-Policy suited to whatever third-party scripts you introduce. None is set by default because a CSP that does not match your actual script origins is worse than none.
- Rate-limit the contact endpoint before launch (Vercel Firewall, or a provider from the Marketplace)
- Keep secrets in Vercel environment variables — never in the repository
