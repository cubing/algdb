import React, { ReactElement } from 'react'
import useJqlQuery from '../../hooks/useJqlQuery'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@chakra-ui/react'
import { Query, Subset } from '../../generated/schema'
import SubsetRow from './SubsetRow'

export default function Algset(): ReactElement {
  const { algsetCode } = useParams<{ algsetCode: string }>()
  const query = React.useMemo(
    () => ({
      name: null,
      id: null,
      code: null,
      mask: null,
      puzzle: {
        name: null,
        code: null,
      },
      algcases: {
        paginatorInfo: {
          total: null,
          count: null,
        },
        data: {
          name: null,
          algs: {
            paginatorInfo: {
              total: null,
              count: null,
            },
            data: {
              sequence: null,
            },
          },
        },
      },
      subsets: {
        paginatorInfo: {
          total: null,
          count: null,
        },
        data: {
          name: null,
          code: null,
          mask: null,
          visualization: null,
          puzzle: {
            code: null,
          },
        },
      },
      score: null,
      __args: {
        is_public: true,
        code: algsetCode,
      },
    }),
    [algsetCode],
  )
  const { isLoading, error, data } = useJqlQuery<Query['getAlgset']>(
    `algset-${algsetCode}`,
    'getAlgset',
    query,
  )
  if (error) return <div>{error.message}</div>
  if (isLoading) return <Skeleton />
  console.log(data)
  return (
    <>
      {data!.subsets.paginatorInfo.count > 0 && (
        <SubsetRow subsets={data!.subsets.data as Subset[]} />
      )}
    </>
  )
}
