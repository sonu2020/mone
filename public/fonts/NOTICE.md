# Bundled Malayalam typefaces

Vendored for the type trial at `/demo/fonts`. Each face keeps its own licence
text alongside the font file; all are SIL Open Font License 1.1.

These are loaded **only** by the demo page, not by the site. Production still
runs the Anek / Noto Sans Malayalam stack from Google Fonts. A browser fetches a
declared face only when text actually renders in it, so listing seven costs
nothing until one is selected.

| Face | Kind | Axes | Author / project | Licence |
| :--- | :--- | :--- | :--- | :--- |
| Malini | Variable | wght 100–900, wdth 75–125, slnt 0–12°, opsz | Santhosh Thottingal — [Malini](https://gitlab.com/smc/fonts/Malini) | [OFL](malini/OFL.txt) |
| Nupuram | Variable | wght 100–900, wdth 75–125, slnt 0 to −15° | Santhosh Thottingal — [Nupuram](https://gitlab.com/smc/fonts/Nupuram) | [OFL](nupuram/OFL.txt) |
| Manjari | Static | Regular, Bold | Santhosh Thottingal / SMC — [Manjari](https://gitlab.com/smc/fonts/Manjari) | [OFL](manjari/OFL.txt) |
| Rachana | Static | Regular, Bold | Hussain K H, R Chitrajakumar / SMC — [Rachana](https://gitlab.com/smc/fonts/Rachana) | [OFL](rachana/OFL.txt) |
| Chilanka | Static | Regular | Santhosh Thottingal — [Chilanka](https://gitlab.com/smc/fonts/chilanka) | [OFL](chilanka/OFL.txt) |

Not vendored — already on the page from Google Fonts:

| Face | Kind | Axes | Notes |
| :--- | :--- | :--- | :--- |
| Anek Malayalam | Variable | wght 100–800, wdth 75–125 | The current production face |
| Noto Sans Malayalam | Variable | wght 100–900 | Site-wide it is requested at 400/700 only; the demo asks for the full range so the weight axis is live there |

Files came from the Swathanthra Malayalam Computing mirror at
`smc.org.in/downloads/fonts/…`; licence texts from each project's GitLab
repository. Refresh by re-downloading from the same paths — see the demo page
header for the upstream links.
