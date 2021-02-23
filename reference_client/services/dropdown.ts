import { executeJomql } from '~/services/jomql'

function memoize(memoizedFn) {
  const cache = {}

  return function () {
    // first arg is always gonna be that, so we will exclude it
    const [that, forceReload, ...otherArgs] = arguments
    const args = JSON.stringify(otherArgs)
    cache[args] = forceReload
      ? memoizedFn(that, false, ...otherArgs)
      : cache[args] || memoizedFn(that, false, ...otherArgs)
    return cache[args]
  }
}

export const getPuzzles = memoize(async function (that, _forceReload = false) {
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

export const getTags = memoize(async function (that, _forceReload = false) {
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

export const getUsertags = memoize(async function (that, _forceReload = false) {
  const data = await executeJomql<'getUsertagPaginator'>(that, {
    getUsertagPaginator: {
      edges: {
        node: {
          id: true,
          name: true,
        },
      },
      __args: {
        first: 100,
        filterBy: [
          {
            'created_by.id': {
              eq: that.$store.getters['auth/user']?.id,
            },
          },
        ],
      },
    },
  })

  return data.edges.map((edge) => edge.node)
})

export const getCaseVisualizations = memoize(async function (
  that,
  _forceReload = false
) {
  const data = await executeJomql<'getCaseVisualizationEnumPaginator'>(that, {
    getCaseVisualizationEnumPaginator: {
      values: true,
    },
  })

  return data.values
})

export const getUserRoles = memoize(async function (
  that,
  _forceReload = false
) {
  const data = await executeJomql<'getUserRoleEnumPaginator'>(that, {
    getUserRoleEnumPaginator: {
      values: true,
    },
  })

  return data.values
})

export const getBooleanOptions = memoize(function (
  _that,
  _forceReload = false
) {
  return Promise.resolve([true, false])
})

export const getNullOptions = memoize(function (_that, _forceReload = false) {
  return Promise.resolve([
    { id: '__null', name: 'None' },
    { id: null, name: 'Any' },
  ])
})
