#!/usr/bin/env python3
"""
build-skills-export.py

Non-destructive build script that produces an OpenAI Apps-SDK / Codex
"Skills" upload artifact from the devpost-hackathons plugin.

It stages the 14 participant-facing skills, inlines every shared dependency
into each skill's own references/ directory, rewrites all cross-folder paths
so each skill is fully self-contained, and zips the result.

It does NOT modify the source repo. Output goes to ./dist/.

Excluded on purpose:
  - build-guide        (shared helper; inlined into build-* skills as references/build-guide.md)
  - .agents/skills/next (internal repo-dev skill)
  - .codex-plugin/, .mcp.json, assets/, marketplace files (plugin-bundle artifacts)

Usage:  python3 build-skills-export.py
"""

import os
import re
import shutil
import zipfile
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PLUGIN = SCRIPT_DIR / "plugins" / "devpost-hackathons"
SKILLS_SRC = PLUGIN / "skills"
# Output dir defaults to ./dist; override with SKILLS_EXPORT_OUT if that
# location isn't writable (e.g. a read-restricted mount).
OUT = Path(os.environ.get("SKILLS_EXPORT_OUT", SCRIPT_DIR / "dist"))
STAGE = OUT / "devpost-hackathon-skills"
ZIP_PATH = OUT / "devpost-hackathon-skills.zip"

# The 14 participant-facing skills (build-guide and `next` are intentionally excluded).
PARTICIPANT_SKILLS = [
    "find-hackathon",
    "start-hackathon",
    "review",
    "resources",
    "hackathon-map",
    "build-onboard",
    "build-scope",
    "build-prd",
    "build-spec",
    "build-checklist",
    "build-project",
    "help-devpost",
    "prepare-submission",
    "submission",
]

BUILD_SKILLS = {
    "build-onboard", "build-scope", "build-prd",
    "build-spec", "build-checklist", "build-project",
}


def copy_tree(src: Path, dst: Path):
    dst.mkdir(parents=True, exist_ok=True)
    for item in src.rglob("*"):
        rel = item.relative_to(src)
        target = dst / rel
        if item.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)


def main():
    if not SKILLS_SRC.is_dir():
        raise SystemExit(f"Cannot find skills source at {SKILLS_SRC}")

    if STAGE.exists():
        shutil.rmtree(STAGE)
    STAGE.mkdir(parents=True, exist_ok=True)

    for skill in PARTICIPANT_SKILLS:
        src = SKILLS_SRC / skill
        if not src.is_dir():
            raise SystemExit(f"Missing expected skill folder: {src}")

        out = STAGE / skill
        # 1. Copy the skill's own files verbatim (SKILL.md, agents/, existing references/).
        copy_tree(src, out)

        refs = out / "references"
        refs.mkdir(exist_ok=True)

        skill_md = out / "SKILL.md"
        text = skill_md.read_text(encoding="utf-8")

        # 2. Inline the shared runtime guidance (every skill references it).
        #    Also copy the supporting content/config/setup it points at, so the
        #    inlined file's own example paths resolve.
        if "../PLUGIN_RUNTIME.md" in text:
            shutil.copy2(SKILLS_SRC / "PLUGIN_RUNTIME.md", refs / "plugin-runtime.md")
            copy_tree(PLUGIN / "content", refs / "content")
            copy_tree(PLUGIN / "config", refs / "config")
            if (PLUGIN / "SETUP.md").exists():
                shutil.copy2(PLUGIN / "SETUP.md", refs / "SETUP.md")
            text = text.replace("../PLUGIN_RUNTIME.md", "references/plugin-runtime.md")

            # Rewrite the inlined runtime doc's own internal references so they
            # resolve from inside references/.
            prt = refs / "plugin-runtime.md"
            t = prt.read_text(encoding="utf-8")
            t = t.replace("../SETUP.md", "SETUP.md")
            # Handle the two-level (../../) prefixes before the one-level (../)
            # variant, otherwise the inner segment matches and leaves a stray ../
            t = t.replace("../../content/", "content/")
            t = t.replace("../../config/", "config/")
            t = t.replace("../content/", "content/")
            t = t.replace("../config/", "config/")
            prt.write_text(t, encoding="utf-8")

        # 3. For build-* skills, inline the build-guide helper + its templates.
        if skill in BUILD_SKILLS:
            if "../build-guide/SKILL.md" in text:
                shutil.copy2(SKILLS_SRC / "build-guide" / "SKILL.md", refs / "build-guide.md")
                text = text.replace("../build-guide/SKILL.md", "references/build-guide.md")
                bg = refs / "build-guide.md"
                bt = bg.read_text(encoding="utf-8")
                # build-guide.md lives beside plugin-runtime.md inside references/.
                bt = bt.replace("../PLUGIN_RUNTIME.md", "plugin-runtime.md")
                bg.write_text(bt, encoding="utf-8")
            # Templates referenced as ../build-guide/templates/<file>
            tdir = SKILLS_SRC / "build-guide" / "templates"
            if tdir.is_dir():
                copy_tree(tdir, refs / "templates")
            text = text.replace("../build-guide/templates/", "references/templates/")

        # 4. Rewrite remaining content/config prefixes to the inlined copies.
        text = re.sub(r"\.\./\.\./content/", "references/content/", text)
        text = text.replace("../../config/", "references/config/")

        skill_md.write_text(text, encoding="utf-8")

    # 5. Zip with the 12 skill folders at the archive root.
    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(STAGE.rglob("*")):
            if f.is_file():
                zf.write(f, f.relative_to(STAGE))

    # Report
    print(f"Staged {len(PARTICIPANT_SKILLS)} skills -> {STAGE}")
    print(f"Wrote zip -> {ZIP_PATH}")


if __name__ == "__main__":
    main()
