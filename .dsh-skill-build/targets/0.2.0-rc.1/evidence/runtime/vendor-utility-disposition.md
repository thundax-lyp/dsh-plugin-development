# Vendor utility package disposition

Exact target: `dsh-v0.2.0-rc.1` at `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

- `vendor/cosmokit/src/index.ts`: generic helpers, no DSH registration seam.
- `vendor/schemastery/src/index.ts`: generic Standard Schema validator. `@deepseek-ai/cordis` accepts Standard Schema through `Plugin.Base.Config`; this concrete library is optional.
- `vendor/logger-console/src/index.ts`: `ConsoleExporter` formats Node log output, with no plugin-owned Agent/Session/Client registration.

These package exports were reviewed for scope and excluded from the DSH plugin-author task ledger; this is an editorial disposition, not runtime verification.
