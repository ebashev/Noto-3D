# License scope

This distribution contains independent code, metadata, and third-party artwork. It is **not** entirely MIT-licensed.

## Project code

Original packaging scripts, runtime helpers, declarations, tests and project documentation are provided under the MIT license in `licenses/Project-MIT.txt`.

## Third-party metadata

Metadata derived from iamcal/emoji-data is covered by its MIT license, retained verbatim in `licenses/emoji-data-MIT.txt`. This grant does not license any vendor's artwork.

## Google Noto 3D artwork: conflicting upstream statements

The static PNGs were obtained from the Google Fonts CDN on 2026-09-21. Smaller PNG and WebP versions are derivatives of those images. Google remains the artwork's author/rightsholder.

As checked on 2026-09-23:

- The Google repository README says tools and most image resources are under Apache License 2.0.
- The root LICENSE at the reviewed commit `06121655d0e82f9cae6e7ba6feed4fa6fdbfc2a4` contains SIL Open Font License 1.1, while the README still links to that file as Apache.
- The gallery FAQ states CC BY 4.0 for **Animated Noto Emoji**, without an equally explicit separate grant for these static 3D PNGs.

The project retains the observed root OFL text and README snapshot, plus the Apache-2.0 reference text. The gallery's mention of [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) is recorded here **without asserting that all three licenses apply, that they are alternatives, or that the project can relicense Google's images**. The repository PNG sampled against the CDN has identical decoded pixels, but different PNG encoding; this does not resolve the scope of the license for the complete CDN snapshot.

Before publicly publishing the image distribution, obtain an authoritative clarification covering redistribution and modification of the static Noto 3D PNGs, then update this file and NOTICE with the exact applicable grant. No blanket legal conclusion is supplied by this package.

Official sources:
- https://github.com/googlefonts/noto-emoji/blob/06121655d0e82f9cae6e7ba6feed4fa6fdbfc2a4/LICENSE
- https://github.com/googlefonts/noto-emoji/blob/06121655d0e82f9cae6e7ba6feed4fa6fdbfc2a4/README.md
- https://googlefonts.github.io/noto-emoji-files/

No Apple artwork is included. No endorsement by Google, npm, jsDelivr or iamcal is claimed.
