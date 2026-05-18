# Learning Stepper PNG Slots

The art-team light-mode secondary stepper exports use these exact names:

- `onboard.png`
- `scope.png`
- `prd.png`
- `spec.png`
- `checklist.png`
- `build.png`
- `return.png`

The Desktop composer reads these paths from `config/hackathon.json` and places the matching image at the start of each optional learning-path response. If a PNG is missing, the response falls back to text progress.
