# @sanity/google-maps-input

>T his is a **Sanity Studio v3** plugin.
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
npm install --save @sanity/google-maps-input
```

or

```
yarn add @sanity/google-maps-input
```

## Usage

Add it as a plugin in sanity.config.ts (or .js), with a valid [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key):

```js
import { googleMapsInput } from "@sanity/google-maps-input";

export default defineConfig({
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

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/google-maps-input/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".
