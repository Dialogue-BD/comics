# Local Problems

A separate, branded 50-card speaking activity about everyday problems in Rajshahi and Bangladesh. Open `/local-problems/` from the site card. Each front places its six labels directly on the matching scenes, which fill the card below the title. The back has six discussion questions. Cards 26–50 focus on small problems a student could investigate and test with little money.

## Activity

- Browse and flip the 50 cards, with optional listening hints and question speech.
- Open Words for each picture label and two useful phrases.
- Play Guess the Category, Guess the Items, or Audio Match. Item guessing hides each labelled scene until it is found; Audio Match uses labelled scene tiles. Pair games are not included.
- Use `pdfs/` for printable two-page card pairs. `pages/` contains the web card images.

`first-25.review.json`, `FIRST_25_DATA_REVIEW.md`, and `second-25.review.json` record the content and source notes. `source-data/` contains the card manifests and original image prompts; the published site contains rendered card images, Audio Match tiles, and print PDFs. Source cutouts remain in the local production workspace. Run `tools/render_labelled_fronts.py --source-dir PATH/TO/rajshahi-problem-cards --output-dir PATH/TO/local-problems` with the Picture This skill and its licensed fonts installed to regenerate the original fronts, tiles, and PDFs. Run `tools/append_second_25.py --site-dir PATH/TO/local-problems` from the local production workspace to rebuild cards 26–50.

The scenes are generated illustrations informed by local reporting and the user brief. They are not photographs of documented individuals or incidents.
