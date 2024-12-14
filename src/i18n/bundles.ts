import {defineLocaleResourceBundle} from 'sanity'
import {i18nNamespace} from './namespace'
import enUSResources from './resources/en-us'

export const i18nBundles = [
  defineLocaleResourceBundle({
    locale: 'en-US',
    namespace: i18nNamespace,
    resources: enUSResources,
  }),
]
