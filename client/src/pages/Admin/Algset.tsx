import React, { ReactElement } from 'react'
import { Link, useParams, useRouteMatch } from 'react-router-dom'
import { Flex, Heading, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { Maybe, Algset, Algcase } from '../../generated/jql'

type AddSubsetProps = {
  OnAdd: () => void
}

function AddSubset ({ OnAdd }: AddSubsetProps): ReactElement {
  return (
    <tr>
      <td />
    </tr>
  )
}

const query = (puzzleCode: string, algsetCode: string, subsetCode : string) => ({
  id: null,
  name: null,
  code: null,
  algcases: {
    data: {
      id: null,
      name: null,
    }
  },
  subsets: {
    data: { 
      id: null,
      code: null,
      name: null,
      algcases: {
        paginatorInfo: {
          count: null,
          total: null,
        },
      },
      subsets: {
        paginatorInfo: {
          count: null,
          total: null,
        },
      }
    },
    __args: {
      parent: null
    }
  },
  __args: {
    code: subsetCode || algsetCode,
    algset_code: algsetCode,
    puzzle_code: puzzleCode,
  }
})

export default function AlgsetPage(): ReactElement {
  const { puzzleCode, algsetCode, subsetCode } = useParams()

  const algset = useJqlQuery<Maybe<Algset>, Error>(
    'getAlgset',
    'getAlgset',
    query(puzzleCode, algsetCode, subsetCode),
  )

  if (algset.isLoading) {
    return (<Spinner />)
  }

  if (algset.error) {
    return (<>{algset.error.message}</>)
  }

  const algCases = algset.data?.algcases?.data || [];
  const subsets: Algset[] = []; // TODO: query for them separate

  return (
    <Flex justify="center" align="center" direction="column">
      <Heading fontSize="4em" textAlign="left">
        {algset.data?.name}
      </Heading>

      <Tabs w="100%">
        <TabList>
          <Tab>Subsets</Tab>
          <Tab>Cases</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <table width="100%">
              <thead>
                <tr>
                  <th style={{textAlign: 'left'}}>ID</th>
                  <th style={{textAlign: 'left'}}>Code</th>
                  <th style={{textAlign: 'left'}}>Name</th>
                  <th style={{textAlign: 'left'}}>Algs</th>
                  <th style={{textAlign: 'left'}}>Subsets</th>
                  <th style={{textAlign: 'left'}}>{' '}</th>
                </tr>
              </thead>
              <tbody>
                {subsets.map((subset) => subset ? (
                  <tr key={subset.id}>
                    <td>{subset.id}</td>
                    <td>{subset.code}</td>
                    <td>{subset.name}</td>
                    <td>{subset.algcases.paginatorInfo.count}</td>
                    <td>
                      { /* subset.subsets.paginatorInfo.count */ }
                      0
                    </td>
                    <td><Link to={`/admin/puzzles/${puzzleCode}/${algsetCode}-${subset.code}`}>Manage</Link></td>
                  </tr>
                ) : false)}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table width="100%">
              <thead>
                <tr>
                  <th style={{textAlign: 'left'}}>ID</th>
                  <th style={{textAlign: 'left'}}>Name</th>
                </tr>
              </thead>
              <tbody>
                {algCases.map((algCase) => algCase ? (
                  <tr key={algCase.id}>
                    <td>{algCase.id}</td>
                    <td>{algCase.name}</td>
                  </tr>
                ) : false)}
              </tbody>
            </table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}