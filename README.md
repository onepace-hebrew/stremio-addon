# One Pace Hebrew Subtitles (Stremio addon)

A [Stremio](https://www.stremio.com/) subtitles addon that serves **Hebrew subtitles for
[One Pace](https://onepace.net/)**. For each available episode it returns:

1. **SRT** (primary) - works in Stremio's built-in player.
2. **ASS** (styled) - best viewed in an external player such as **mpv**.

The addon is serverless-friendly: it is deployed to [Beamup](https://github.com/Stremio/stremio-beamup)
(free Stremio hosting) and serves **public** subtitle URLs that point at the raw files in this
repository, so no local file serving is required.

Episode ids follow the [`au2001/onepace-stremio`](https://github.com/au2001/onepace-stremio)
stream addon scheme (`<ARC_CODE>_<episode-number>`, e.g. `WS_19`, `EN_1`), so this addon's
subtitles line up with the One Pace streams users are already watching.

## Install in Stremio

Once deployed to Beamup, add the addon by its manifest URL:

```
https://<your-app>.beamup.dev/manifest.json
```

(Replace `<your-app>` with the app name Beamup assigns you.)

In Stremio:

1. Open **Addons**, paste the manifest URL, and install.
2. Play a One Pace episode (via the One Pace stream addon).
3. Pick the **Hebrew** subtitle track. The **SRT** entry plays in Stremio's default player.
   For the styled **ASS** version, route playback to **mpv** (which renders ASS styling correctly).

## How it works

`mapping.json` maps each episode id to public raw URLs:

```jsonc
{
  "WS_19": {
    "arc": "16 Water Seven",
    "ep": 19,
    "srt": "https://raw.githubusercontent.com/onepace-hebrew/stremio-addon/main/subtitles/main/16%20Water%20Seven/19/waterseven%2019%20he.srt",
    "ass": "https://raw.githubusercontent.com/onepace-hebrew/stremio-addon/main/subtitles/main/16%20Water%20Seven/19/waterseven%2019%20he.ass"
  }
}
```

`scripts/build-mapping.js` scans `subtitles/main/**` and regenerates `mapping.json` deterministically.
`index.js` (the addon) reads `mapping.json` and returns the SRT first, then the ASS (if present).

## Adding a new episode

1. Drop the Hebrew files under the matching arc/episode path:

   ```
   subtitles/main/<NN Arc>/<ep>/<stem> he.srt
   subtitles/main/<NN Arc>/<ep>/<stem> he.ass   # optional
   ```

   Example: `subtitles/main/17 Enies Lobby/02/enieslobby 02 he.srt`

2. If the arc is new, add its code to the `ARC_CODES` map in
   [`scripts/build-mapping.js`](scripts/build-mapping.js)
   (e.g. `'18 Thriller Bark': 'TB'`).

3. Commit and `git push` to `main`. The GitHub Action
   ([`.github/workflows/build.yml`](.github/workflows/build.yml)) rebuilds `mapping.json`
   and commits it back so it stays in sync. Beamup auto-redeploys on push.

You can also rebuild locally:

```bash
npm run build-mapping
```

## Local development

```bash
npm install
npm start          # serves on http://127.0.0.1:7000/manifest.json
```

## Deploy to Beamup

Beamup is Stremio's free hosting for addons. It deploys via a dedicated git remote and
auto-redeploys on every push. You must authenticate (SSH key) the first time.

**Option A - Beamup CLI**

```bash
npm i -g beamup-cli
beamup            # follow prompts to authenticate and create/select the app,
                  # then it configures the `beamup` git remote for you
git push beamup main
```

**Option B - manual git remote (Stremio beamup flow)**

```bash
# Add the Beamup git remote (host/app per Stremio's beamup setup), authenticate via SSH:
git remote add beamup <beamup-git-url>
git push beamup main
```

After the first successful deploy, Beamup prints your addon URL
(`https://<your-app>.beamup.dev/manifest.json`). Subsequent `git push beamup main` redeploys.

> Note: Beamup runs the addon serverless, so it cannot serve local files. That is why
> `mapping.json` points at public `raw.githubusercontent.com` URLs of this repo.

## Credits

- **Hebrew translation:** That One Gerbil
- **One Pace:** the [One Pace](https://onepace.net/) project and community
- Built with the [Stremio Addon SDK](https://github.com/Stremio/stremio-addon-sdk)

## License

[MIT](LICENSE) - One Pace Hebrew contributors.
