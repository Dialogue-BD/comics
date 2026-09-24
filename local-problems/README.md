# Local Problems

A separate, branded 25-card speaking activity about everyday problems in Rajshahi and Bangladesh. Open `/local-problems/` from the site card. Each front places its six labels directly on the matching scenes, which fill the card below the title. The back has six discussion questions.

## Activity

- Browse and flip the 25 cards, with optional listening hints and question speech.
- Open Words for each picture label and two useful phrases.
- Play Guess the Category, Guess the Items, or Audio Match. Item guessing hides each labelled scene until it is found; Audio Match uses labelled scene tiles. Pair games are not included.
- Use `pdfs/` for printable two-page card pairs. `pages/` contains the web card images.

`first-25.review.json` and `FIRST_25_DATA_REVIEW.md` record the content and source notes. `source-data/` contains the card manifests and original image prompts; the published site contains rendered card images, Audio Match tiles, and print PDFs. Source cutouts remain in the local production workspace. Run `tools/render_labelled_fronts.py --source-dir PATH/TO/rajshahi-problem-cards --output-dir PATH/TO/local-problems` with the Picture This skill and its licensed fonts installed to regenerate the fronts, tiles, and PDFs.

The scenes are generated illustrations informed by local reporting and the user brief. They are not photographs of documented individuals or incidents.
