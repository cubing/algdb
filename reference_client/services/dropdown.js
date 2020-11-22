import { executeJomql } from '~/services/jomql.js'

export async function getPuzzles() {
  const data = await executeJomql('getMultiplePuzzle', {
    data: {
      id: true,
      name: true,
      code: true,
    },
  })

  return data.data
}

export async function getCaseVisualizations() {
  const data = await executeJomql('getAllCaseVisualization', {
    name: true,
  })

  return data.map((item) => item.name)
}

export function getBooleanOptions() {
  return Promise.resolve([true, false])
}
