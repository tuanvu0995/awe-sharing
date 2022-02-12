const URL = `https://avataaars.io/`

const AVATAR_STYLE = `Circle`

const TOP_TYPES = [
  'NoHair',
  'Eyepatch',
  'Hat',
  'Hijab',
  'Turban',
  'WinterHat1',
  'WinterHat2',
  'WinterHat3',
  'WinterHat4',
  'LongHairBigHair',
  'LongHairBob',
  'LongHairBun',
  'LongHairCurly',
  'LongHairCurvy',
  'LongHairDreads',
  'LongHairFrida',
  'LongHairFro',
  'LongHairFroBand',
  'LongHairNotTooLong',
  'LongHairShavedSides',
  'LongHairMiaWallace',
  'LongHairStraight',
  'LongHairStraight2',
  'LongHairStraightStrand',
  'ShortHairDreads01',
  'ShortHairDreads02',
  'ShortHairFrizzle',
  'ShortHairShaggyMullet',
  'ShortHairShortCurly',
  'ShortHairShortFlat',
  'ShortHairShortRound',
  'ShortHairShortWaved',
  'ShortHairSides',
  'ShortHairTheCaesar',
  'ShortHairTheCaesarSidePart',
]

const ACCESSORIES_TYPES = [
  'Blank',
  'Kurt',
  'Prescription01',
  'Prescription02',
  'Round',
  'Sunglasses',
  'Wayfarers',
]

const FACIAL_HAIR_TYPES = [
  'Blank',
  'BeardMedium',
  'BeardLight',
  'BeardMajestic',
  'MoustacheFancy',
  'MoustacheMagnum',
]

const FACIAL_HAIR_COLORS = [
  'Auburn',
  'Black',
  'Blonde',
  'BlondeGolden',
  'Brown',
  'BrownDark',
  'Red',
]

const HAT_COLORES = [
  'Auburn',
  'Black',
  'Blonde',
  'BlondeGolden',
  'Brown',
  'BrownDark',
  'PastelPink',
  'Blue',
  'Platinum',
  'Red',
  'SilverGray',
]

const CLOTHE_TYPES = [
  'BlazerShirt',
  'BlazerSweater',
  'CollarSweater',
  'GraphicShirt',
  'Hoodie',
  'Overall',
  'ShirtCrewNeck',
  'ShirtScoopNeck',
  'ShirtVNeck',
]

const CLOTHE_COLORS = [
  'Black',
  'Blue01',
  'Blue02',
  'Blue03',
  'Gray01',
  'Gray02',
  'Heather',
  'PastelBlue',
  'PastelGreen',
  'PastelOrange',
  'PastelRed',
  'PastelYellow',
  'Pink',
  'Red',
  'White',
]

const EYE_TYPES = [
  'Close',
  'Cry',
  'Default',
  'Dizzy',
  'EyeRoll',
  'Happy',
  'Hearts',
  'Side',
  'Squint',
  'Surprised',
  'Wink',
  'WinkWacky',
]

const EYE_BROW_TYPES = [
  'Angry',
  'AngryNatural',
  'Default',
  'DefaultNatural',
  'FlatNatural',
  'RaisedExcited',
  'RaisedExcitedNatural',
  'SadConcerned',
  'SadConcernedNatural',
  'UnibrowNatural',
  'UpDown',
  'UpDownNatural',
]

const MOUTH_TYPES = [
  'Concerned',
  'Default',
  'Disbelief',
  'Eating',
  'Grimace',
  'Sad',
  'ScreamOpen',
  'Serious',
  'Smile',
  'Tongue',
  'Twinkle',
  'Vomit',
]

const SKIN_COLORS = ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black']

class AvatarGenter {
  buildAvatar(): string {
    let query = ''
    query += '?avatarStyle=' + AVATAR_STYLE
    query += '&topType=' + this.randomItemFromArray(TOP_TYPES)
    query += '&accessoriesType=' + this.randomItemFromArray(ACCESSORIES_TYPES)
    query += '&hatColor=' + this.randomItemFromArray(HAT_COLORES)
    query += '&facialHairType=' + this.randomItemFromArray(FACIAL_HAIR_TYPES)
    query += '&facialHairColor=' + this.randomItemFromArray(FACIAL_HAIR_COLORS)
    query += '&clotheType=' + this.randomItemFromArray(CLOTHE_TYPES)
    query += '&clotheColor=' + this.randomItemFromArray(CLOTHE_COLORS)
    query += '&eyeType=' + this.randomItemFromArray(EYE_TYPES)
    query += '&eyebrowType=' + this.randomItemFromArray(EYE_BROW_TYPES)
    query += '&mouthType=' + this.randomItemFromArray(MOUTH_TYPES)
    query += '&skinColor=' + this.randomItemFromArray(SKIN_COLORS)
    return query
  }
  randomItemFromArray(items: string[]): any {
    return items[Math.floor(Math.random() * items.length)]
  }
}

export default new AvatarGenter()
