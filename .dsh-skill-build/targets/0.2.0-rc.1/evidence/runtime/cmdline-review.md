# Cmdline app plugin consumer review

Target: `dsh-v0.2.0-rc.1` at `4878cdabd87d4041bdaff61d04c966883b9fd07a`.
Source checked: `packages/boot/cmdline/src/index.ts`, package export and peer manifest.
Fixture: `evidence/tests/cmdline-consumer` outside the target checkout.

- Initial npm install with Cordis `0.2.0-rc.1` failed `ERESOLVE`: the released cmdline package requires Cordis `~4.0.4`. Corrected fixture to `@deepseek-ai/cordis@4.0.4`.
- `npm install --ignore-scripts --no-audit --no-fund`: pass, 10 packages.
- `npm run build`: TypeScript pass after correcting fixture cleanup from `root.dispose()` to `root.fiber.dispose()` per target type.
- `npm run check`: `cmdline consumer PASS`; parsed `--port 4217`, provided service, disposed fiber and observed service removal.
- No real launcher/Profile, help/error, EOF, Agent/Session or Client run.
