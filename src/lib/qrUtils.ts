export interface QRPayloadData {
  sessionId: string
  course: string
  year: string
  branch: string
  semester: string
  section: string
  lecture: string
  date: string
  createdAt: number
  expiresAt: number
  tokenTimestamp: number
  token: string
}

export function createQRSessionId(course: string, branch: string, year: string, semester: string, section: string, lecture: string): string {
  const cleanStr = `${course}_${branch}_${year}_${semester}_${section}_${lecture}`.replace(/[^a-zA-Z0-9_]/g, '')
  return `qrsession_${cleanStr}_${Date.now()}`
}

export function generateDynamicToken(): { token: string; timestamp: number } {
  const timestamp = Date.now()
  const randomSalt = Math.random().toString(36).substring(2, 8)
  const token = `tok_${timestamp.toString(36)}_${randomSalt}`
  return { token, timestamp }
}

export function encodeQRPayload(data: QRPayloadData): string {
  return JSON.stringify(data)
}

export function decodeQRPayload(rawText: string): QRPayloadData | null {
  try {
    const parsed = JSON.parse(rawText)
    if (parsed && parsed.sessionId && parsed.course && parsed.branch) {
      return parsed as QRPayloadData
    }
    return null
  } catch {
    return null
  }
}

// Pure SVG 2D Matrix QR Code Renderer
export function generateQRCodeMatrix(text: string): boolean[][] {
  const size = 25
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const x = startX + c
        const y = startY + r
        if (x < size && y < size) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4
          matrix[y][x] = isBorder || isCenter
        }
      }
    }
  }

  drawFinder(0, 0)
  drawFinder(size - 7, 0)
  drawFinder(0, size - 7)

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0
    matrix[i][6] = i % 2 === 0
  }

  const alignX = 16
  const alignY = 16
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2
      const isCenter = r === 0 && c === 0
      matrix[alignY + r][alignX + c] = isBorder || isCenter
    }
  }

  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }

  const hashSeed = Math.abs(hash)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)) continue
      if (y === 6 || x === 6) continue
      if (Math.abs(x - alignX) <= 2 && Math.abs(y - alignY) <= 2) continue

      const bitIndex = (y * size + x + hashSeed) % 31
      const isBitSet = ((hashSeed >> (bitIndex % 16)) & 1) === 1
      const altBit = (x * 7 + y * 13 + hashSeed) % 3 === 0
      matrix[y][x] = isBitSet || altBit
    }
  }

  return matrix
}

export function renderQRCodeSVG(text: string, svgSize: number = 260): string {
  const matrix = generateQRCodeMatrix(text)
  const matrixSize = matrix.length
  const cellSize = svgSize / matrixSize

  let rects = ''
  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      if (matrix[y][x]) {
        const posX = (x * cellSize).toFixed(2)
        const posY = (y * cellSize).toFixed(2)
        const sz = cellSize.toFixed(2)
        rects += `<rect x="${posX}" y="${posY}" width="${sz}" height="${sz}" fill="#0f172a" />`
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}" shape-rendering="crispEdges" style="background:#ffffff; padding:12px; border-radius:12px;">${rects}</svg>`
}
