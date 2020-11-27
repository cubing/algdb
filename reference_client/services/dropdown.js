import { executeJomql } from '~/services/jomql.js'

function memoize(memoizedFn) {
  let cache

  return function () {
    cache = cache || memoizedFn()
    return cache
  }
}

export const getPuzzles = memoize(async function () {
  const data = await executeJomql('getMultiplePuzzle', {
    data: {
      id: true,
      name: true,
    },
  })

  return data.data.map((item) => ({ value: item.id + '', text: item.name }))
})

export const getCaseVisualizations = memoize(async function () {
  const data = await executeJomql('getAllCaseVisualization', {
    name: true,
  })

  return data.map((item) => item.name)
})

export const getBooleanOptions = memoize(function () {
  return Promise.resolve([true, false])
})

export const getNullOptions = memoize(function () {
  return Promise.resolve([
    { value: 'null', text: 'None' },
    { value: null, text: 'Any' },
  ])
})
