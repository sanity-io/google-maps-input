import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {googleMapsInput} from './src/index'

export default defineConfig({
  projectId: 'ppsg7ml5',
  dataset: 'test',
  plugins: [
    structureTool({
      structure: (S) => S.documentTypeList('geopointTest'),
    }),
    googleMapsInput({
      apiKey: 'AIzaSyDDO2FFi5wXaQdk88S1pQUa70bRtWuMhkI',
    }),
  ],
  schema: {
    types: [
      {
        name: 'geopointTest',
        type: 'document',
        fields: [
          {name: 'title', type: 'string'},
          {name: 'location', type: 'geopoint'},
          {name: 'arrayOfLocations', type: 'array', of: [{type: 'geopoint'}]},
          {
            name: 'address',
            type: 'object',
            hidden: true,
            fields: [
              {name: 'city', type: 'string'},
              {name: 'country', type: 'string'},
            ],
          },
        ],
      },
    ],
  },
  tasks: {
    enabled: false,
  },
  scheduledPublishing: {
    enabled: false,
  },
  announcements: {
    enabled: false,
  },
  beta: {
    create: {
      startInCreateEnabled: false,
    },
  },
})
