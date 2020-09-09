import React, { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Heading, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { Maybe, Algset, Algcase } from '../../generated/jql'


const query = (algsetId: number) => ({
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
    }
  },
  __args: {
    id: algsetId
  }
})

export default function AlgsetPage(): ReactElement {
  const { algsetCode } = useParams()

  const { isLoading, data, error } = useJqlQuery<Maybe<Algset>, Error>(
    'getAlgset',
    'getAlgset',
    query(parseInt(algsetCode, 10)),
  )

  if (isLoading) {
    return (<Spinner />)
  }

  if (error) {
    return (<>{error.message}</>)
  }

  const algCases = data?.algcases?.data || [];
  const subsets = data?.subsets?.data || [];

  return (
    <Flex justify="center" align="center" direction="column">
      <Heading fontSize="4em" textAlign="left">
        {data?.name}
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
                </tr>
              </thead>
              <tbody>
                {subsets.map((subset) => subset ? (
                  <tr key={subset.id}>
                    <td>{subset.id}</td>
                    <td>{subset.code}</td>
                    <td>{subset.name}</td>
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