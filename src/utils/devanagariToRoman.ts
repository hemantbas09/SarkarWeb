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
  व: 'v',
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

const isConsonant = (character: string | undefined) =>
  character !== undefined &&
  (consonants[character] !== undefined || consonants[character + '़'] !== undefined)

export function devanagariToRoman(text: string): string {
  const characters = Array.from(text)
  let roman = ''

  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index]
    const nuktaConsonant = consonants[character + '़']
    const consonant = nuktaConsonant ?? consonants[character]

    if (consonant) {
      roman += consonant
      if (nuktaConsonant) index += 1

      const next = characters[index + 1]
      if (next === '्') {
        index += 1
      } else if (next && vowelMarks[next]) {
        roman += vowelMarks[next]
        index += 1
      } else {
        const following = characters[index + 1]
        const wordEnds = following === undefined || !/[\p{L}\p{M}]/u.test(following)
        const beforeLongA = isConsonant(following) && characters[index + 2] === 'ा'
        if (!wordEnds && !beforeLongA) roman += 'a'
      }
      continue
    }

    if (vowels[character]) roman += vowels[character]
    else if (vowelMarks[character]) roman += vowelMarks[character]
    else if (nasalMarks[character]) roman += nasalMarks[character]
    else if (character === 'ः') roman += 'h'
    else if (character === 'ऽ') roman += "'"
    else if (devnagariDigits[character]) roman += devnagariDigits[character]
    else if (character !== '्' && character !== '़' && character !== '‍' && character !== '‌') {
      roman += character
    }
  }

  return roman
}
