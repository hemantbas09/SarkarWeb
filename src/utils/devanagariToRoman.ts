
const vowels: Record<string, string> = {
  अ: 'a',
  आ: 'a',
  इ: 'i',
  ई: 'i',
  उ: 'u',
  ऊ: 'u',
  ऋ: 'ri',
  ए: 'e',
  ऐ: 'ai',
  ओ: 'o',
  औ: 'au',
}

const vowelMarks: Record<string, string> = {
  'ा': 'a',
  'ि': 'i',
  'ी': 'i',
  'ु': 'u',
  'ू': 'u',
  'ृ': 'ri',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
}

const consonants: Record<string, string> = {
  क: 'k',
  ख: 'kh',
  ग: 'g',
  घ: 'gh',
  ङ: 'ng',

  च: 'ch',
  छ: 'chh',
  ज: 'j',
  झ: 'jh',
  ञ: 'ny',

  ट: 't',
  ठ: 'th',
  ड: 'd',
  ढ: 'dh',
  ण: 'n',

  त: 't',
  थ: 'th',
  द: 'd',
  ध: 'dh',
  न: 'n',

  प: 'p',
  फ: 'ph',
  ब: 'b',
  भ: 'bh',
  म: 'm',

  य: 'y',
  र: 'r',
  ल: 'l',
  व: 'w',

  श: 'sh',
  ष: 'sh',
  स: 's',
  ह: 'h',

  क्ष: 'ksh',
  त्र: 'tr',
  ज्ञ: 'gy',

  ड़: 'r',
  ढ़: 'rh',
}

const nasalMarks: Record<string, string> = {
  'ं': 'n',
  'ँ': 'n',
}

const devnagariDigits: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
}

const isConsonant = (character: string | undefined): boolean =>
  character !== undefined && consonants[character] !== undefined

export function devanagariToRoman(text: string): string {
  const characters = Array.from(text)
  let roman = ''

  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index]

    // Handle nukta consonants such as ड़ and ढ़.
    const hasNukta = characters[index + 1] === '़'
    const nuktaConsonant = hasNukta ? consonants[character + '़'] : undefined
    const consonant = nuktaConsonant ?? consonants[character]

    if (consonant) {
      roman += consonant

      if (nuktaConsonant && hasNukta) {
        index += 1
      }

      const next = characters[index + 1]

      // Explicit virama: क् → k
      if (next === '्') {
        index += 1
        continue
      }

      // Vowel mark: का → ka, कि → ki, कु → ku
      if (next && vowelMarks[next]) {
        roman += vowelMarks[next]
        index += 1
        continue
      }

      const following = characters[index + 1]

      // A consonant normally has an inherent "a".
      const wordEnds =
        following === undefined ||
        !/[\p{L}\p{M}]/u.test(following)

      // Avoid adding an extra "a" before a consonant
      // followed by a long-aa mark.
      //
      // Example:
      // बाङ्गड → bangad
      const beforeLongA =
        isConsonant(following) &&
        characters[index + 2] === 'ा'

      if (!wordEnds && !beforeLongA) {
        roman += 'a'
      }

      continue
    }

    // Independent vowels.
    if (vowels[character]) {
      roman += vowels[character]
      continue
    }

    // Standalone vowel marks.
    if (vowelMarks[character]) {
      roman += vowelMarks[character]
      continue
    }

    // Nasal sounds.
    if (nasalMarks[character]) {
      roman += nasalMarks[character]
      continue
    }

    // Visarga.
    if (character === 'ः') {
      roman += 'h'
      continue
    }

    // Avagraha.
    if (character === 'ऽ') {
      roman += "'"
      continue
    }

    // Devanagari digits.
    if (devnagariDigits[character]) {
      roman += devnagariDigits[character]
      continue
    }

    // Ignore Devanagari control marks.
    if (
      character === '्' ||
      character === '़' ||
      character === '‍' ||
      character === '‌'
    ) {
      continue
    }

    // Preserve spaces, punctuation, English characters, etc.
    roman += character
  }

  return roman
}
