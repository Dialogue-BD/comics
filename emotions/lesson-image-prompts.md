# How Are You Feeling? — image prompts for the teaching slides

These images replace the vector art in the six projected lesson panels. The lesson engine still animates everything: words fly, the shutter drops, the camera moves and expressions change. So I need the art in **layers**, not as finished slides:

- **Backplates**: empty scenes with no people in them.
- **Character cutouts**: one person, one pose, one expression, on a transparent background.

Generate them in ChatGPT, then drop the files into `emotions/img/` using the filenames below. I'll wire them in.

---

## 1. Rules for every image

Paste this block at the top of every prompt, or once at the start of the chat and then say "same style" after that.

> **Style:** Warm, modern editorial illustration for an English-language classroom app in Bangladesh. Soft flat shapes with gentle gradients and subtle paper grain, like a premium picture book. No hard black outlines; edges are defined by colour and soft shading. Rounded, friendly proportions (heads about one-fifth of body height). Calm, hopeful mood.
> **Palette:** Deep forest green #103D21, muted gold #B9924F, warm paper #F4F1E6, with accents of clay #B0563A, plum #6B3F80, sky blue #3F7FA6 and sunflower #E1B84B. Skin tones warm brown (South Asian and African).
> **Absolutely no text, letters, numbers, logos or UI in the image.** No speech bubbles.
> **Lighting:** soft morning light from the upper left.

**Transparent cutouts:** add *"Isolated on a fully transparent background, PNG, no shadow on the ground, full upper body from the waist up, facing three-quarters toward the viewer."*

**Backplates:** use a wide landscape (1536×1024). The lesson crops it to a 2.6 : 1 strip, keeping roughly the middle 60% of the height, so keep the top and bottom 20% free of anything important.

---

## 2. The cast (keep them consistent)

Before the first cutout, describe each person once in the chat and ask ChatGPT to "keep this exact character" in later prompts. If it drifts, re-upload the first good image as a reference.

| Key | Who | Look |
|---|---|---|
| `teacher` | The teacher | Bangladeshi man, about 35. Short neat black hair, round glasses, kind smile. Forest-green collared shirt (#1F5C4A). |
| `learner` | The main student | Bangladeshi young woman, about 20. Plum hijab (#7C4A8E) wrapped softly under the chin; peach-orange kameez top (#E7A96B). Expressive eyebrows. |
| `friend` | The classmate who laughs | Young African man, about 21. Short curly black hair, sunflower-yellow shirt (#E1B84B). Big expressive mouth. |
| `boy` | The student in "Name it" | Bangladeshi young man, about 19. Short side-parted hair, sky-blue shirt (#3F7FA6). |
| `girl` | The student in "Chunks" | Bangladeshi young woman, about 19. Long straight black hair; coral top (#C9625A). |

---

## 3. Backplates (no people)

| File | Prompt (after the style block) |
|---|---|
| `bg-classroom.png` | A bright, tidy language classroom interior seen straight on, empty. On the left, a green chalkboard in a light wooden frame, with faint chalk lines but no words. A round wall clock high in the middle. A cork bulletin board with blank pastel paper notes on the right, and a potted snake plant in a terracotta pot in the far-right corner. A warm cream wall with a darker lower panel and a light wooden floor. Lots of empty wall space in the centre. |
| `bg-classroom-desk.png` | The same classroom, closer, with one light-wood student desk on the right third holding two closed books (blue and yellow) and a pencil. The chair is empty. |
| `bg-studio-warm.png` | An abstract, soft studio backdrop: a warm paper background with two huge, blurry colour washes (pale gold top-left, pale sage bottom-right) and a faint soft floor shadow. Nothing else. |
| `bg-studio-storm.png` | The same studio backdrop, but the left third fades into a cool grey-blue haze, as if a storm sits there, clearing to warm paper on the right. |
| `bg-hill-morning.png` | A gentle green hill rising from bottom-left to top-right under a pale morning sky. A soft sun and two small white clouds. A few round little trees are dotted along the slope. Plenty of empty sky in the upper-left third. |
| `bg-iceberg.png` | A side-view cross-section of calm sea: pale sky above, a single clean iceberg in the centre-right with a small tip above the waterline and a much bigger mass below fading into deep blue-green water. Soft light rays underwater. Leave the left 40% as open sea and sky. |

---

## 4. Character cutouts (transparent)

Wording pattern: *"[cast description]. Pose: … Expression: …"* followed by the transparent-cutout line.

### Teacher
| File | Pose | Expression |
|---|---|---|
| `teacher-present.png` | Right arm out to the side, open palm up, presenting something | Warm, encouraging smile |
| `teacher-point.png` | Right arm pointing up and to the side at a board | Friendly, explaining |

### Learner (the heart of the story, so she needs the most states)
| File | Pose | Expression |
|---|---|---|
| `learner-smile.png` | Sitting upright, hands resting on a desk (desk not drawn) | Relaxed, open smile |
| `learner-worry-hug.png` | Arms crossed tightly, hugging herself, shoulders slightly raised | Embarrassed and worried: brows up in the middle, small tight mouth |
| `learner-calm-heart.png` | One hand resting on her chest, eyes gently closed | Calm, breathing slowly |
| `learner-present.png` | One hand out, palm up, mid-sentence | Unsure but trying |
| `learner-wave.png` | One hand raised, open palm, as if asking to try again | Brave small smile |
| `learner-shrug.png` | Both palms up at shoulder height | Flat, withdrawn, "I don't care" |
| `learner-phone.png` | Holding a phone at chest height, looking at it | Happy, interested |

### Friend
| File | Pose | Expression |
|---|---|---|
| `friend-laugh.png` | Pointing to the viewer's left with one hand, other hand on his stomach | Laughing hard, eyes squeezed shut |
| `friend-point-phone.png` | Pointing down-left toward a phone someone else holds | Laughing kindly, sharing the joke |
| `friend-smile.png` | Arms relaxed | Kind smile |

### Boy ("Name it to tame it")
| File | Pose | Expression |
|---|---|---|
| `boy-worry-hug.png` | Arms crossed, hugging himself | Stressed, brows pulled together |
| `boy-chin.png` | One hand on his chin, thinking | Searching for the right word |
| `boy-heart.png` | Hand on chest | Settling, relieved |
| `boy-wave.png` | Hand raised, open palm | Relieved smile |

### Girl ("A word never walks alone")
| File | Pose | Expression |
|---|---|---|
| `girl-chin.png` | Hand on chin | Puzzled |
| `girl-present.png` | Hand out, palm up | Growing confidence |
| `girl-wave.png` | Hand raised in a small cheer | Delighted |

---

## 5. Small props (transparent, optional)

| File | Prompt |
|---|---|
| `prop-storm-cloud.png` | One dark slate-grey storm cloud with a yellow lightning bolt and a few light-blue raindrops |
| `prop-sun.png` | A soft, glowing golden sun with short rounded rays |
| `prop-shutter.png` | A clay-red roller shutter (like a shop shutter) with a dark brown housing box on top, pulled fully down, seen straight on, tall and narrow (1 : 3.5) |
| `prop-butterflies.png` | Two small butterflies, one gold and one pink, fluttering |

---

## 6. When you're done

1. Save everything as PNG in `emotions/img/`. Cutouts must have real transparency; check them on a dark background.
2. If a character drifts between images, redo that one using the first good image as the reference.
3. Tell me, and I'll swap the vector layers for the images while keeping the animation, camera moves and beats.
