## When can a new fulfiller be added?

- **Upfront:** During `Start.txt` questionnaire, user identifies a missing condition.
- **Mid‑build:** During implementation, a previously unknown condition surfaces.

## Process (same for both triggers)

1. **Isolate the condition** – Write it as a single atomic statement.
2. **Confirm non‑basic** – Is this something an AI wouldn't know automatically? If basic, implement directly; do not create fulfiller.
3. **Draft spec** – Use 8‑section template.
4. **Implement in current app** – Test thoroughly.
5. **Finalize spec** – Add verification steps, limits.
6. **Integration test** – With existing fulfillers.
7. **Update index and `Start.txt`** – Add question if a new user‑facing condition is introduced.
8. **Declare ready** – Fulfiller added to library.
