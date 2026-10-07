# API member discovery correction — dsh-v0.2.0-rc.1

The target commit is `4878cdabd87d4041bdaff61d04c966883b9fd07a`.

The first TypeScript symbol inventory used `checker.getPropertiesOfType` and therefore included class `private` and `protected` declarations as apparent public members. The creator generator now excludes those modifier flags and ECMAScript `#private` names, with a regression fixture for a re-exported class. Its 29 creator tests passed. An explicit `--refresh` recomputed `evidence/api-symbol-candidates.json` from the same exact checkout after identity validation; the ordinary invocation continues to reject differences.

The human `api-surface.json` queue was reconciled only by removing members absent from the refreshed exact-target symbol list. This removed 2,913 false candidate members: 2,659 pending, 249 previously excluded, and 5 previously included. No export entry or object symbol disappeared. The removal reduces false coverage pressure but does not adjudicate the remaining public members. Reference text for affected selected objects still needs a semantic audit before freeze.

The generator also now drops TypeScript's unstable `__@...` internal display names for computed-symbol keys. Their actual `Symbol.*` semantics remain a manual source-review item when a plugin task uses them. After refreshing the same target again, no such synthetic member needed removal from `api-surface.json` because the initializer had not seeded them. One object signature and seven member signatures were synchronized to the refreshed candidate output; these differences were display ordering of string-literal unions, not API changes.
