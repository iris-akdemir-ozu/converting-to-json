/**
 * Turkish Character Encoding Converter
 * Based on the provided encoding libraries for Windows-1254 and ISO-8859-9
 */

/**
 * Windows-1254 to UTF-8 converter
 * Based on win1254.js
 */
export function convertWindows1254ToUTF8(input: Uint8Array): string {
  const len = input.length
  const output: number[] = []
  let count = 0

  for (let i = 0; i < len; i++) {
    const byte = input[i]

    switch (byte) {
      case 128: // €
        output[count++] = 0xe2
        output[count++] = 0x82
        output[count++] = 0xac
        break
      case 129:
        output[count++] = 0xc2
        output[count++] = 0x81
        break
      case 130: // ‚
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x9a
        break
      case 131: // ƒ
        output[count++] = 0xc6
        output[count++] = 0x92
        break
      case 132: // „
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x9e
        break
      case 133: // …
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0xa6
        break
      case 134: // †
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0xa0
        break
      case 135: // ‡
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0xa1
        break
      case 136: // ˆ
        output[count++] = 0xcb
        output[count++] = 0x86
        break
      case 137: // ‰
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0xb0
        break
      case 138: // Š
        output[count++] = 0xc5
        output[count++] = 0xa0
        break
      case 139: // ‹
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0xb9
        break
      case 140: // Œ
        output[count++] = 0xc5
        output[count++] = 0x92
        break
      case 141:
        output[count++] = 0xc2
        output[count++] = 0x8d
        break
      case 142:
        output[count++] = 0xc2
        output[count++] = 0x8e
        break
      case 143:
        output[count++] = 0xc2
        output[count++] = 0x8f
        break
      case 144:
        output[count++] = 0xc2
        output[count++] = 0x90
        break
      case 145: // '
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x98
        break
      case 146: // '
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x99
        break
      case 147: // "
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x9c
        break
      case 148: // "
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x9d
        break
      case 149: // •
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0xa2
        break
      case 150: // –
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x93
        break
      case 151: // —
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0x94
        break
      case 152: // ˜
        output[count++] = 0xcb
        output[count++] = 0x9c
        break
      case 153: // ™
        output[count++] = 0xe2
        output[count++] = 0x84
        output[count++] = 0xa2
        break
      case 154: // š
        output[count++] = 0xc5
        output[count++] = 0xa1
        break
      case 155: // ›
        output[count++] = 0xe2
        output[count++] = 0x80
        output[count++] = 0xba
        break
      case 156: // œ
        output[count++] = 0xc5
        output[count++] = 0x93
        break
      case 157:
        output[count++] = 0xc2
        output[count++] = 0x9d
        break
      case 158:
        output[count++] = 0xc2
        output[count++] = 0x9e
        break
      case 159: // Ÿ
        output[count++] = 0xc5
        output[count++] = 0xb8
        break
      case 160: //
        output[count++] = 0xc2
        output[count++] = 0xa0
        break
      case 161: // ¡
        output[count++] = 0xc2
        output[count++] = 0xa1
        break
      case 162: // ¢
        output[count++] = 0xc2
        output[count++] = 0xa2
        break
      case 163: // £
        output[count++] = 0xc2
        output[count++] = 0xa3
        break
      case 164: // ¤
        output[count++] = 0xc2
        output[count++] = 0xa4
        break
      case 165: // ¥
        output[count++] = 0xc2
        output[count++] = 0xa5
        break
      case 166: // ¦
        output[count++] = 0xc2
        output[count++] = 0xa6
        break
      case 167: // §
        output[count++] = 0xc2
        output[count++] = 0xa7
        break
      case 168: // ¨
        output[count++] = 0xc2
        output[count++] = 0xa8
        break
      case 169: // ©
        output[count++] = 0xc2
        output[count++] = 0xa9
        break
      case 170: // ª
        output[count++] = 0xc2
        output[count++] = 0xaa
        break
      case 171: // «
        output[count++] = 0xc2
        output[count++] = 0xab
        break
      case 172: // ¬
        output[count++] = 0xc2
        output[count++] = 0xac
        break
      case 173: // ­
        output[count++] = 0xc2
        output[count++] = 0xad
        break
      case 174: // ®
        output[count++] = 0xc2
        output[count++] = 0xae
        break
      case 175: // ¯
        output[count++] = 0xc2
        output[count++] = 0xaf
        break
      case 176: // °
        output[count++] = 0xc2
        output[count++] = 0xb0
        break
      case 177: // ±
        output[count++] = 0xc2
        output[count++] = 0xb1
        break
      case 178: // ²
        output[count++] = 0xc2
        output[count++] = 0xb2
        break
      case 179: // ³
        output[count++] = 0xc2
        output[count++] = 0xb3
        break
      case 180: // ´
        output[count++] = 0xc2
        output[count++] = 0xb4
        break
      case 181: // µ
        output[count++] = 0xc2
        output[count++] = 0xb5
        break
      case 182: // ¶
        output[count++] = 0xc2
        output[count++] = 0xb6
        break
      case 183: // ·
        output[count++] = 0xc2
        output[count++] = 0xb7
        break
      case 184: // ¸
        output[count++] = 0xc2
        output[count++] = 0xb8
        break
      case 185: // ¹
        output[count++] = 0xc2
        output[count++] = 0xb9
        break
      case 186: // º
        output[count++] = 0xc2
        output[count++] = 0xba
        break
      case 187: // »
        output[count++] = 0xc2
        output[count++] = 0xbb
        break
      case 188: // ¼
        output[count++] = 0xc2
        output[count++] = 0xbc
        break
      case 189: // ½
        output[count++] = 0xc2
        output[count++] = 0xbd
        break
      case 190: // ¾
        output[count++] = 0xc2
        output[count++] = 0xbe
        break
      case 191: // ¿
        output[count++] = 0xc2
        output[count++] = 0xbf
        break
      case 192: // À
        output[count++] = 0xc3
        output[count++] = 0x80
        break
      case 193: // Á
        output[count++] = 0xc3
        output[count++] = 0x81
        break
      case 194: // Â
        output[count++] = 0xc3
        output[count++] = 0x82
        break
      case 195: // Ã
        output[count++] = 0xc3
        output[count++] = 0x83
        break
      case 196: // Ä
        output[count++] = 0xc3
        output[count++] = 0x84
        break
      case 197: // Å
        output[count++] = 0xc3
        output[count++] = 0x85
        break
      case 198: // Æ
        output[count++] = 0xc3
        output[count++] = 0x86
        break
      case 199: // Ç
        output[count++] = 0xc3
        output[count++] = 0x87
        break
      case 200: // È
        output[count++] = 0xc3
        output[count++] = 0x88
        break
      case 201: // É
        output[count++] = 0xc3
        output[count++] = 0x89
        break
      case 202: // Ê
        output[count++] = 0xc3
        output[count++] = 0x8a
        break
      case 203: // Ë
        output[count++] = 0xc3
        output[count++] = 0x8b
        break
      case 204: // Ì
        output[count++] = 0xc3
        output[count++] = 0x8c
        break
      case 205: // Í
        output[count++] = 0xc3
        output[count++] = 0x8d
        break
      case 206: // Î
        output[count++] = 0xc3
        output[count++] = 0x8e
        break
      case 207: // Ï
        output[count++] = 0xc3
        output[count++] = 0x8f
        break
      case 208: // Ğ (Turkish)
        output[count++] = 0xc4
        output[count++] = 0x9e
        break
      case 209: // Ñ
        output[count++] = 0xc3
        output[count++] = 0x91
        break
      case 210: // Ò
        output[count++] = 0xc3
        output[count++] = 0x92
        break
      case 211: // Ó
        output[count++] = 0xc3
        output[count++] = 0x93
        break
      case 212: // Ô
        output[count++] = 0xc3
        output[count++] = 0x94
        break
      case 213: // Õ
        output[count++] = 0xc3
        output[count++] = 0x95
        break
      case 214: // Ö
        output[count++] = 0xc3
        output[count++] = 0x96
        break
      case 215: // ×
        output[count++] = 0xc3
        output[count++] = 0x97
        break
      case 216: // Ø
        output[count++] = 0xc3
        output[count++] = 0x98
        break
      case 217: // Ù
        output[count++] = 0xc3
        output[count++] = 0x99
        break
      case 218: // Ú
        output[count++] = 0xc3
        output[count++] = 0x9a
        break
      case 219: // Û
        output[count++] = 0xc3
        output[count++] = 0x9b
        break
      case 220: // Ü
        output[count++] = 0xc3
        output[count++] = 0x9c
        break
      case 221: // İ (Turkish)
        output[count++] = 0xc4
        output[count++] = 0xb0
        break
      case 222: // Ş (Turkish)
        output[count++] = 0xc5
        output[count++] = 0x9e
        break
      case 223: // ß
        output[count++] = 0xc3
        output[count++] = 0x9f
        break
      case 224: // à
        output[count++] = 0xc3
        output[count++] = 0xa0
        break
      case 225: // á
        output[count++] = 0xc3
        output[count++] = 0xa1
        break
      case 226: // â
        output[count++] = 0xc3
        output[count++] = 0xa2
        break
      case 227: // ã
        output[count++] = 0xc3
        output[count++] = 0xa3
        break
      case 228: // ä
        output[count++] = 0xc3
        output[count++] = 0xa4
        break
      case 229: // å
        output[count++] = 0xc3
        output[count++] = 0xa5
        break
      case 230: // æ
        output[count++] = 0xc3
        output[count++] = 0xa6
        break
      case 231: // ç
        output[count++] = 0xc3
        output[count++] = 0xa7
        break
      case 232: // è
        output[count++] = 0xc3
        output[count++] = 0xa8
        break
      case 233: // é
        output[count++] = 0xc3
        output[count++] = 0xa9
        break
      case 234: // ê
        output[count++] = 0xc3
        output[count++] = 0xaa
        break
      case 235: // ë
        output[count++] = 0xc3
        output[count++] = 0xab
        break
      case 236: // ì
        output[count++] = 0xc3
        output[count++] = 0xac
        break
      case 237: // í
        output[count++] = 0xc3
        output[count++] = 0xad
        break
      case 238: // î
        output[count++] = 0xc3
        output[count++] = 0xae
        break
      case 239: // ï
        output[count++] = 0xc3
        output[count++] = 0xaf
        break
      case 240: // ğ (Turkish)
        output[count++] = 0xc4
        output[count++] = 0x9f
        break
      case 241: // ñ
        output[count++] = 0xc3
        output[count++] = 0xb1
        break
      case 242: // ò
        output[count++] = 0xc3
        output[count++] = 0xb2
        break
      case 243: // ó
        output[count++] = 0xc3
        output[count++] = 0xb3
        break
      case 244: // ô
        output[count++] = 0xc3
        output[count++] = 0xb4
        break
      case 245: // õ
        output[count++] = 0xc3
        output[count++] = 0xb5
        break
      case 246: // ö
        output[count++] = 0xc3
        output[count++] = 0xb6
        break
      case 247: // ÷
        output[count++] = 0xc3
        output[count++] = 0xb7
        break
      case 248: // ø
        output[count++] = 0xc3
        output[count++] = 0xb8
        break
      case 249: // ù
        output[count++] = 0xc3
        output[count++] = 0xb9
        break
      case 250: // ú
        output[count++] = 0xc3
        output[count++] = 0xba
        break
      case 251: // û
        output[count++] = 0xc3
        output[count++] = 0xbb
        break
      case 252: // ü
        output[count++] = 0xc3
        output[count++] = 0xbc
        break
      case 253: // ı (Turkish)
        output[count++] = 0xc4
        output[count++] = 0xb1
        break
      case 254: // ş (Turkish)
        output[count++] = 0xc5
        output[count++] = 0x9f
        break
      case 255: // ÿ
        output[count++] = 0xc3
        output[count++] = 0xbf
        break
      default:
        output[count++] = byte
        break
    }
  }

  // Convert byte array to UTF-8 string
  const utf8Bytes = new Uint8Array(output.slice(0, count))
  return new TextDecoder("utf-8").decode(utf8Bytes)
}

/**
 * ISO-8859-9 to UTF-8 converter
 * Based on iso9.js
 */
export function convertISO8859_9ToUTF8(input: Uint8Array): string {
  const len = input.length
  const output: number[] = []
  let count = 0

  for (let i = 0; i < len; i++) {
    const byte = input[i]

    switch (byte) {
      case 128:
        output[count++] = 0xc2
        output[count++] = 0x80
        break
      case 129:
        output[count++] = 0xc2
        output[count++] = 0x81
        break
      case 130:
        output[count++] = 0xc2
        output[count++] = 0x82
        break
      case 131:
        output[count++] = 0xc2
        output[count++] = 0x83
        break
      case 132:
        output[count++] = 0xc2
        output[count++] = 0x84
        break
      case 133:
        output[count++] = 0xc2
        output[count++] = 0x85
        break
      case 134:
        output[count++] = 0xc2
        output[count++] = 0x86
        break
      case 135:
        output[count++] = 0xc2
        output[count++] = 0x87
        break
      case 136:
        output[count++] = 0xc2
        output[count++] = 0x88
        break
      case 137:
        output[count++] = 0xc2
        output[count++] = 0x89
        break
      case 138:
        output[count++] = 0xc2
        output[count++] = 0x8a
        break
      case 139:
        output[count++] = 0xc2
        output[count++] = 0x8b
        break
      case 140:
        output[count++] = 0xc2
        output[count++] = 0x8c
        break
      case 141:
        output[count++] = 0xc2
        output[count++] = 0x8d
        break
      case 142:
        output[count++] = 0xc2
        output[count++] = 0x8e
        break
      case 143:
        output[count++] = 0xc2
        output[count++] = 0x8f
        break
      case 144:
        output[count++] = 0xc2
        output[count++] = 0x90
        break
      case 145:
        output[count++] = 0xc2
        output[count++] = 0x91
        break
      case 146:
        output[count++] = 0xc2
        output[count++] = 0x92
        break
      case 147:
        output[count++] = 0xc2
        output[count++] = 0x93
        break
      case 148:
        output[count++] = 0xc2
        output[count++] = 0x94
        break
      case 149:
        output[count++] = 0xc2
        output[count++] = 0x95
        break
      case 150:
        output[count++] = 0xc2
        output[count++] = 0x96
        break
      case 151:
        output[count++] = 0xc2
        output[count++] = 0x97
        break
      case 152:
        output[count++] = 0xc2
        output[count++] = 0x98
        break
      case 153:
        output[count++] = 0xc2
        output[count++] = 0x99
        break
      case 154:
        output[count++] = 0xc2
        output[count++] = 0x9a
        break
      case 155:
        output[count++] = 0xc2
        output[count++] = 0x9b
        break
      case 156:
        output[count++] = 0xc2
        output[count++] = 0x9c
        break
      case 157:
        output[count++] = 0xc2
        output[count++] = 0x9d
        break
      case 158:
        output[count++] = 0xc2
        output[count++] = 0x9e
        break
      case 159:
        output[count++] = 0xc2
        output[count++] = 0x9f
        break
      case 160:
        output[count++] = 0xc2
        output[count++] = 0xa0
        break
      case 161:
        output[count++] = 0xc2
        output[count++] = 0xa1
        break
      case 162:
        output[count++] = 0xc2
        output[count++] = 0xa2
        break
      case 163:
        output[count++] = 0xc2
        output[count++] = 0xa3
        break
      case 164:
        output[count++] = 0xc2
        output[count++] = 0xa4
        break
      case 165:
        output[count++] = 0xc2
        output[count++] = 0xa5
        break
      case 166:
        output[count++] = 0xc2
        output[count++] = 0xa6
        break
      case 167:
        output[count++] = 0xc2
        output[count++] = 0xa7
        break
      case 168:
        output[count++] = 0xc2
        output[count++] = 0xa8
        break
      case 169:
        output[count++] = 0xc2
        output[count++] = 0xa9
        break
      case 170:
        output[count++] = 0xc2
        output[count++] = 0xaa
        break
      case 171:
        output[count++] = 0xc2
        output[count++] = 0xab
        break
      case 172:
        output[count++] = 0xc2
        output[count++] = 0xac
        break
      case 173:
        output[count++] = 0xc2
        output[count++] = 0xad
        break
      case 174:
        output[count++] = 0xc2
        output[count++] = 0xae
        break
      case 175:
        output[count++] = 0xc2
        output[count++] = 0xaf
        break
      case 176:
        output[count++] = 0xc2
        output[count++] = 0xb0
        break
      case 177:
        output[count++] = 0xc2
        output[count++] = 0xb1
        break
      case 178:
        output[count++] = 0xc2
        output[count++] = 0xb2
        break
      case 179:
        output[count++] = 0xc2
        output[count++] = 0xb3
        break
      case 180:
        output[count++] = 0xc2
        output[count++] = 0xb4
        break
      case 181:
        output[count++] = 0xc2
        output[count++] = 0xb5
        break
      case 182:
        output[count++] = 0xc2
        output[count++] = 0xb6
        break
      case 183:
        output[count++] = 0xc2
        output[count++] = 0xb7
        break
      case 184:
        output[count++] = 0xc2
        output[count++] = 0xb8
        break
      case 185:
        output[count++] = 0xc2
        output[count++] = 0xb9
        break
      case 186:
        output[count++] = 0xc2
        output[count++] = 0xba
        break
      case 187:
        output[count++] = 0xc2
        output[count++] = 0xbb
        break
      case 188:
        output[count++] = 0xc2
        output[count++] = 0xbc
        break
      case 189:
        output[count++] = 0xc2
        output[count++] = 0xbd
        break
      case 190:
        output[count++] = 0xc2
        output[count++] = 0xbe
        break
      case 191:
        output[count++] = 0xc2
        output[count++] = 0xbf
        break
      case 192:
        output[count++] = 0xc3
        output[count++] = 0x80
        break
      case 193:
        output[count++] = 0xc3
        output[count++] = 0x81
        break
      case 194:
        output[count++] = 0xc3
        output[count++] = 0x82
        break
      case 195:
        output[count++] = 0xc3
        output[count++] = 0x83
        break
      case 196:
        output[count++] = 0xc3
        output[count++] = 0x84
        break
      case 197:
        output[count++] = 0xc3
        output[count++] = 0x85
        break
      case 198:
        output[count++] = 0xc3
        output[count++] = 0x86
        break
      case 199:
        output[count++] = 0xc3
        output[count++] = 0x87
        break
      case 200:
        output[count++] = 0xc3
        output[count++] = 0x88
        break
      case 201:
        output[count++] = 0xc3
        output[count++] = 0x89
        break
      case 202:
        output[count++] = 0xc3
        output[count++] = 0x8a
        break
      case 203:
        output[count++] = 0xc3
        output[count++] = 0x8b
        break
      case 204:
        output[count++] = 0xc3
        output[count++] = 0x8c
        break
      case 205:
        output[count++] = 0xc3
        output[count++] = 0x8d
        break
      case 206:
        output[count++] = 0xc3
        output[count++] = 0x8e
        break
      case 207:
        output[count++] = 0xc3
        output[count++] = 0x8f
        break
      case 208: // Ğ (Turkish)
        output[count++] = 0xc4
        output[count++] = 0x9e
        break
      case 209:
        output[count++] = 0xc3
        output[count++] = 0x91
        break
      case 210:
        output[count++] = 0xc3
        output[count++] = 0x92
        break
      case 211:
        output[count++] = 0xc3
        output[count++] = 0x93
        break
      case 212:
        output[count++] = 0xc3
        output[count++] = 0x94
        break
      case 213:
        output[count++] = 0xc3
        output[count++] = 0x95
        break
      case 214:
        output[count++] = 0xc3
        output[count++] = 0x96
        break
      case 215:
        output[count++] = 0xc3
        output[count++] = 0x97
        break
      case 216:
        output[count++] = 0xc3
        output[count++] = 0x98
        break
      case 217:
        output[count++] = 0xc3
        output[count++] = 0x99
        break
      case 218:
        output[count++] = 0xc3
        output[count++] = 0x9a
        break
      case 219:
        output[count++] = 0xc3
        output[count++] = 0x9b
        break
      case 220:
        output[count++] = 0xc3
        output[count++] = 0x9c
        break
      case 221: // İ (Turkish)
        output[count++] = 0xc4
        output[count++] = 0xb0
        break
      case 222: // Ş (Turkish)
        output[count++] = 0xc5
        output[count++] = 0x9e
        break
      case 223:
        output[count++] = 0xc3
        output[count++] = 0x9f
        break
      case 224:
        output[count++] = 0xc3
        output[count++] = 0xa0
        break
      case 225:
        output[count++] = 0xc3
        output[count++] = 0xa1
        break
      case 226:
        output[count++] = 0xc3
        output[count++] = 0xa2
        break
      case 227:
        output[count++] = 0xc3
        output[count++] = 0xa3
        break
      case 228:
        output[count++] = 0xc3
        output[count++] = 0xa4
        break
      case 229:
        output[count++] = 0xc3
        output[count++] = 0xa5
        break
      case 230:
        output[count++] = 0xc3
        output[count++] = 0xa6
        break
      case 231:
        output[count++] = 0xc3
        output[count++] = 0xa7
        break
      case 232:
        output[count++] = 0xc3
        output[count++] = 0xa8
        break
      case 233:
        output[count++] = 0xc3
        output[count++] = 0xa9
        break
      case 234:
        output[count++] = 0xc3
        output[count++] = 0xaa
        break
      case 235:
        output[count++] = 0xc3
        output[count++] = 0xab
        break
      case 236:
        output[count++] = 0xc3
        output[count++] = 0xac
        break
      case 237:
        output[count++] = 0xc3
        output[count++] = 0xad
        break
      case 238:
        output[count++] = 0xc3
        output[count++] = 0xae
        break
      case 239:
        output[count++] = 0xc3
        output[count++] = 0xaf
        break
      case 240: // ğ (Turkish)
        output[count++] = 0xc4
        output[count++] = 0x9f
        break
      case 241:
        output[count++] = 0xc3
        output[count++] = 0xb1
        break
      case 242:
        output[count++] = 0xc3
        output[count++] = 0xb2
        break
      case 243:
        output[count++] = 0xc3
        output[count++] = 0xb3
        break
      case 244:
        output[count++] = 0xc3
        output[count++] = 0xb4
        break
      case 245:
        output[count++] = 0xc3
        output[count++] = 0xb5
        break
      case 246:
        output[count++] = 0xc3
        output[count++] = 0xb6
        break
      case 247:
        output[count++] = 0xc3
        output[count++] = 0xb7
        break
      case 248:
        output[count++] = 0xc3
        output[count++] = 0xb8
        break
      case 249:
        output[count++] = 0xc3
        output[count++] = 0xb9
        break
      case 250:
        output[count++] = 0xc3
        output[count++] = 0xba
        break
      case 251:
        output[count++] = 0xc3
        output[count++] = 0xbb
        break
      case 252:
        output[count++] = 0xc3
        output[count++] = 0xbc
        break
      case 253: // ı (Turkish)
        output[count++] = 0xc4
        output[count++] = 0xb1
        break
      case 254: // ş (Turkish)
        output[count++] = 0xc5
        output[count++] = 0x9f
        break
      case 255:
        output[count++] = 0xc3
        output[count++] = 0xbf
        break
      default:
        output[count++] = byte
        break
    }
  }

  // Convert byte array to UTF-8 string
  const utf8Bytes = new Uint8Array(output.slice(0, count))
  return new TextDecoder("utf-8").decode(utf8Bytes)
}

/**
 * ISO-8859-1 to UTF-8 converter
 * Based on iso1.js
 */
export function convertISO8859_1ToUTF8(input: Uint8Array): string {
  const len = input.length
  const output: number[] = []
  let count = 0

  for (let i = 0; i < len; i++) {
    const byte = input[i]

    if (byte < 128) {
      // ASCII characters
      output[count++] = byte
    } else {
      // Extended characters (128-255) - convert to UTF-8
      output[count++] = 0xc2 + (byte >> 6)
      output[count++] = 0x80 + (byte & 0x3f)
    }
  }

  // Convert byte array to UTF-8 string
  const utf8Bytes = new Uint8Array(output.slice(0, count))
  return new TextDecoder("utf-8").decode(utf8Bytes)
}

/**
 * Main encoding converter function
 * @param buffer - Raw file buffer
 * @param encoding - Target encoding to convert from
 * @returns Converted UTF-8 string
 */
export function convertToUTF8(buffer: ArrayBuffer, encoding: string): string {
  const uint8Array = new Uint8Array(buffer)

  switch (encoding.toLowerCase()) {
    case "windows-1254":
    case "win-1254":
      return convertWindows1254ToUTF8(uint8Array)

    case "iso-8859-9":
      return convertISO8859_9ToUTF8(uint8Array)

    case "iso-8859-1":
      return convertISO8859_1ToUTF8(uint8Array)

    case "utf-8":
    case "utf-8-bom":
    default:
      // For UTF-8, use TextDecoder
      const decoder = new TextDecoder("utf-8")
      let content = decoder.decode(uint8Array)

      // Remove BOM if present
      if (content.charCodeAt(0) === 0xfeff) {
        content = content.substring(1)
      }

      return content
  }
}
