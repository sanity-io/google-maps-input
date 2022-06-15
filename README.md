# @sanity/google-maps-input

> **NOTE**
>
> This is the **Sanity Studio v3 version** of @sanity/google-maps-input.
>
> For the v2 version, please refer to the [v2-branch](https://github.com/sanity-io/sanity/tree/next/packages/%40sanity/google-maps-input).

## What is it? 
Plugin for [Sanity Studio](https://www.sanity.io) providing input handlers for geo-related input types using Google Maps.

This plugin will replace the default `geopoint` input component.

![Google maps input](assets/google-maps-input.png)

## Know issues in Studio V3

* Diff-preview is not implemented.

These will be re-added well before Studio V3 GA.

## Installation

In your studio folder, run:

```
npm install --save @sanity/google-maps-input@studio-v3
```

or

```
yarn add @sanity/google-maps-input@studio-v3
```

## Usage

Add it as a plugin in sanity.config.ts (or .js), with a valid [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key):

```js
import { googleMapsInput } from "@sanity/google-maps-input";

export default createConfig({
  // ...
  plugins: [
      googleMapsInput({
          apiKey: "my-api-key"
     })
  ] 
})
```
Ensure that the key has access to:
* Google Maps JavaScript API
* Google Places API Web Service
* Google Static Maps API

And that the key allows web-access from the Studio URL(s) you are using the plugin in. 

Note: This plugin will replace the default `geopoint` input component.

## Stuck? Get help

[![Slack Community Button](https://slack.sanity.io/badge.svg)](https://slack.sanity.io/)

Join [Sanity’s developer community](https://slack.sanity.io) or ping us [on twitter](https://twitter.com/sanity_io).

## License

MIT-licensed. See LICENSE.

## Develop & test

Make sure to run `npm run build` once, then run

```bash
npm run link-watch
```

In another shell, `cd` to your test studio and run:

```bash
npx yalc add @sanity/google-maps-input --link && yarn install
```

Now, changes in this repo will be automatically built and pushed to the studio,
triggering hotreload. Yalc avoids issues with react-hooks that are typical when using yarn/npm link.

### About build & watch

This plugin uses [@sanity/plugin-sdk](https://github.com/sanity-io/plugin-sdk)
with default configuration for build & watch scripts.


