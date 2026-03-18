This section now reads a real preview-manifest in the same shape used by demo_studio.

Expected file:

- preview-manifest.json

Expected asset structure:

- The assetPath values inside preview-manifest.json must point to files that are reachable from this Next.js app's public directory.
- Example:
  - /mock/job_demo_head_001/hair-back.svg
  - /mock/job_demo_head_001/face-base.svg

Recommended workflow:

1. Copy demo_studio's generated preview-manifest.json here as:
   - public/layer-logic/preview-manifest.json
2. Copy the generated preview assets into matching public paths.
3. Keep the original assetPath values if you preserve the same folder structure under public.

The landing page Layer Logic section will then:

- render the real layer stack
- show full preview vs solo layer preview
- build the layer tree from manifest.folderPath and manifest.layers
