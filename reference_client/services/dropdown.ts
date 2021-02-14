import { executeJomql } from '~/services/jomql'

function memoize(memoizedFn) {
  const cache = {}

  return function () {
    // first arg is always gonna be that, so we will exclude it
    const [that, ...otherArgs] = arguments
    const args = JSON.stringify(otherArgs)
    cache[args] = cache[args] || memoizedFn(that, ...otherArgs)
    return cache[args]
  }
}

export const getPuzzles = memoize(async function (that) {
  const data = await executeJomql<'getPuzzlePaginator'>(that, {
    getPuzzlePaginator: {
      edges: {
        node: {
          id: true,
          name: true,
        },
      },
      __args: {
        first: 100,
      },
    },
  })

  return data.edges.map((edge) => edge.node)
})

export const getTags = memoize(async function (that) {
  const data = await executeJomql<'getTagPaginator'>(that, {
    getTagPaginator: {
      edges: {
        node: {
          id: true,
          name: true,
        },
      },
      __args: {
        first: 100,
      },
    },
  })

  return data.edges.map((edge) => edge.node)
})

export const getCaseVisualizations = memoize(async function (that) {
  const data = await executeJomql<'getCaseVisualizationEnumPaginator'>(that, {
    getCaseVisualizationEnumPaginator: {
      values: true,
    },
  })

  return data.values
})

export const getBooleanOptions = memoize(function (_that) {
  return Promise.resolve([true, false])
})

export const getNullOptions = memoize(function (_that) {
  return Promise.resolve([
    { value: 'null', text: 'None' },
    { value: null, text: 'Any' },
  ])
})
