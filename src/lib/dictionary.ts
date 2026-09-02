import enDict from '../dictionaries/en.json'
import nlDict from '../dictionaries/nl.json'
import deDict from '../dictionaries/de.json'
import frDict from '../dictionaries/fr.json'
import esDict from '../dictionaries/es.json'

export function getDictionary(locale: string) {
  switch (locale) {
    case 'en': return enDict;
    case 'de': return deDict;
    case 'fr': return frDict;
    case 'es': return esDict;
    case 'nl': return nlDict;
    // DEFAULT_LOCALE is 'en' — overal, behalve hier. Een onbekende locale gaf
    // een Nederlandse UI onder een Engelse canonical.
    default: return enDict;
  }
}
