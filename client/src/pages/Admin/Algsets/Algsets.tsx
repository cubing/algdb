import React, { ReactElement, useState, ChangeEvent, MouseEvent } from 'react'
import { Link, useParams, useRouteMatch } from 'react-router-dom'
import {
  Flex,
  Heading,
  Spinner,
  Input,
  Button,
  Select,
  FormLabel,
  Checkbox,
  Stack,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from '@chakra-ui/core'
import AddAlgset, { AlgsetMutationArgs } from './AddAlgset'
import useJqlQuery from '../../../hooks/useJqlQuery'
import useJqlMutation from '../../../hooks/useJqlMutation'
import { Maybe, Algset, AlgsetPaginator, PuzzlePaginator } from '../../../generated/jql'

const getAlgsetsQuery = (puzzle?: string) => {
  const query = {
    paginatorInfo: {
      count: null,
      total: null,
    },
    data: {
      id: null,
      name: null,
      puzzle: {
        id: null,
        name: null,
        code: null
      },
      code: null,
      mask: null,
      visualization: {
        name: null,
      },
      is_public: null,
      created_at: null,
    },
    __args: {
    }
  }

  if (puzzle) {
    // eslint-disable-next-line no-underscore-dangle
    query.__args = {
      puzzle: parseInt(puzzle, 10),
    }
  }

  return query;
}

export default function Algsets(): ReactElement {
  const [ editingAlgsetId, setEditingAlgsetId ] = useState<string | undefined>();
  const [ editingAlgsetName, setEditingAlgsetName ] = useState<string | undefined>();
  const [ editingAlgsetVisualization, setEditingAlgsetVisualization ] = useState<string | undefined>();
  const [ editingAlgsetPublic, setEditingAlgsetPublic ] = useState<boolean | undefined>();
  const [ editingAlgsetMask, setEditingAlgsetMask ] = useState<Maybe<string> | null>();

  const { puzzleId } = useParams()
  const match = useRouteMatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoading, data, refetch, error } = useJqlQuery<AlgsetPaginator, Error>(
    'getMultipleAlgset',
    'getMultipleAlgset',
    getAlgsetsQuery(puzzleId),
  )

  const puzzleQuery = useJqlQuery<PuzzlePaginator, Error>(
    'getMultiplePuzzle',
    'getMultiplePuzzle',
    {
      data: {
        name: null,
        code: null
      }
    }
  )

  const [mutateAlgset, updateAlgsetMutation] = useJqlMutation<
    Maybe<Algset>,
    Error,
    AlgsetMutationArgs
  >('updateAlgset', {})

  const puzzles = puzzleQuery?.data?.data || []

  const algsets = data?.data || []

  const edit = (algset: Algset) =>
    (event: MouseEvent) => {
      onOpen();
      setEditingAlgsetName(algset.name)
      setEditingAlgsetVisualization(algset.visualization.name)
      setEditingAlgsetPublic(algset.is_public)
      setEditingAlgsetMask(algset.mask)
      setEditingAlgsetId(algset.id)
    }

  const saveAlgset = async () => {
    await mutateAlgset({
      id: editingAlgsetId,
      name: editingAlgsetName,
      visualization: editingAlgsetVisualization,
      is_public: editingAlgsetPublic,
      mask: editingAlgsetMask,
    })
    refetch()
    onClose()
  }

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <>{error.message}</>
  }

  return (
    <Flex justify="center" align="center" direction="column">
      <Heading fontSize="4em" textAlign="center">
        Algsets
      </Heading>
      <Flex w="80%" align="center" direction="column">
        <table width="100%">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>ID</th>
              <th style={{textAlign: 'left'}}>Name</th>
              <th style={{textAlign: 'left'}}>Puzzle</th>
              <th style={{textAlign: 'left'}}>Visible</th>
              <th style={{textAlign: 'left'}}>Created</th>
              <th style={{textAlign: 'left'}} rowSpan={2}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {algsets.map((algset) => algset ? (
              <tr key={algset.id}>
                <td>{algset.id}</td>
                <td>{algset.name}</td>
                <td>{algset.puzzle?.name}</td>
                <td>{algset.is_public ? 'true' : 'false'}</td>
                <td>{new Date(algset.created_at * 1000).toLocaleString()}</td>
                <td><Button onClick={edit(algset)}>Edit</Button></td>
                <td><Link to={`${match.url}/${algset.id}`}>Manage</Link></td>
              </tr>
            ) : false)}
            <AddAlgset onAdd={refetch} puzzles={puzzles} />
          </tbody>
        </table>
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          placement="right"
          size="md"
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                Editing
                {' '}
                {editingAlgsetName}
              </DrawerHeader>
              <DrawerBody>
                <Stack spacing="1.5em">
                  <Box>
                    <FormLabel htmlFor="editingAlgsetName">Name</FormLabel>
                    <Input
                      value={editingAlgsetName}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setEditingAlgsetName(event.target.value)
                      }}
                      id="editingAlgsetName"
                      placeholder={editingAlgsetName}
                    />
                  </Box>

                  <Box>
                    <FormLabel htmlFor="editingAlgsetVisualization">Visualization</FormLabel>
                    <Select
                      value={editingAlgsetVisualization}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                        setEditingAlgsetVisualization(event.target.value)
                      }}
                      id="editingAlgsetVisualization"
                    >
                      <option value="V_2D">V_2D</option>
                      <option value="V_3D">V_3D</option>
                      <option value="V_PG3D">VPg3D</option>
                    </Select>
                  </Box>

                  <Box>
                    <FormLabel htmlFor="editingAlgsetMask">Mask</FormLabel>
                    <Input
                      value={editingAlgsetMask || ''}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setEditingAlgsetMask(event.target.value)
                      }}
                      id="editingAlgsetMask"
                      placeholder={editingAlgsetMask || ''}
                    />
                  </Box>

                  <Box>
                    <Checkbox
                      isChecked={editingAlgsetPublic}
                      onChange={(event) => {
                        setEditingAlgsetPublic(event.target.checked)
                      }}
                    >
                      Visible
                    </Checkbox>
                  </Box>

                </Stack>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button color="blue" onClick={saveAlgset} isLoading={updateAlgsetMutation.isLoading}>Save</Button>
              </DrawerFooter>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Flex>
    </Flex>
  )
}
