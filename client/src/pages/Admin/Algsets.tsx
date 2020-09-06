import React, { ReactElement, useState, ChangeEvent, MouseEvent, FormEvent } from 'react'
import {
  Flex,
  Heading,
  Spinner,
  Input,
  Button,
  Select,
  FormLabel,
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
import useJqlQuery from '../../hooks/useJqlQuery'
import useJqlMutation from '../../hooks/useJqlMutation'
import { Maybe, Algset, AlgsetPaginator, Puzzle, PuzzlePaginator } from '../../generated/jql'

type AddAlgsetProps = {
  onAdd: () => void
  puzzles: Array<Maybe<Puzzle>>
}

type AlgsetMutationArgs = {
  id?: string
  name?: string
  puzzle?: string
  mask?: string
  visualization?: string
}

function AddAlgset({ onAdd, puzzles }: AddAlgsetProps): ReactElement {
  const [algsetName, setAlgsetName] = useState<string>('')
  const [selectedPuzzle, setSelectedPuzzle] = useState<string>('0')

  const [mutate, { isLoading, error }] = useJqlMutation<
    Maybe<Algset>,
    Error,
    AlgsetMutationArgs
  >('createAlgset', {
    id: null,
    name: null,
  })

  const onClick = async (e: MouseEvent<HTMLButtonElement> | FormEvent) => {
    e.preventDefault();
    if (algsetName) {
      try {
        await mutate({
          name: algsetName,
          puzzle: selectedPuzzle,
        })
        onAdd()
        setAlgsetName('')
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAlgsetName(event.target.value)
  }

  const handleChangePuzzle = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPuzzle(event.target.value)
  }

  if (error) {
    console.error(error);
  }

  return (
    <tr>
      <td />
      <td>
        <Input placeholder="OLL" value={algsetName} onChange={handleChange} />
      </td>
      <td>
        <Select value={selectedPuzzle} onChange={handleChangePuzzle}>
          <option key={0} value="0">Select</option>
          {puzzles.map((puzzle) => (
            <option key={puzzle?.id} value={puzzle?.id}>{puzzle?.name}</option>
          ))}
        </Select>
      </td>
      <td>
        <Button isLoading={isLoading} isDisabled={!algsetName} onClick={onClick}>Add</Button>
      </td>
    </tr>
  )
}

const getAlgsetsQuery = {
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
    },
    mask: null,
    visualization: {
      name: null,
    },
    created_at: null,
  },
}

export default function Algsets(): ReactElement {
  const [ editingAlgsetId, setEditingAlgsetId ] = useState<string | undefined>();
  const [ editingAlgsetName, setEditingAlgsetName ] = useState<string | undefined>();
  const [ editingAlgsetVisualization, setEditingAlgsetVisualization ] = useState<string | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoading, data, refetch, error } = useJqlQuery<AlgsetPaginator, Error>(
    'getMultipleAlgset',
    'getMultipleAlgset',
    getAlgsetsQuery,
  )

  const puzzleQuery = useJqlQuery<PuzzlePaginator, Error>(
    'getMultiplePuzzle',
    'getMultiplePuzzle',
    {
      data: {
        name: null
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
      setEditingAlgsetId(algset.id)
    }

  const saveAlgset = async () => {
    await mutateAlgset({
      id: editingAlgsetId,
      name: editingAlgsetName,
      visualization: editingAlgsetVisualization,
    })
    refetch()
    onClose()
  }

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return <>error</>
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
              <th style={{textAlign: 'left'}}>Visualization</th>
              <th style={{textAlign: 'left'}}>Created</th>
              <th style={{textAlign: 'left'}}>{' '}</th>
            </tr>
          </thead>
          <tbody>
            {algsets.map((algset) => algset ? (
              <tr key={algset.id}>
                <td>{algset.id}</td>
                <td>{algset.name}</td>
                <td>{algset.puzzle?.name}</td>
                <td>{algset?.visualization?.name}</td>
                <td>{new Date(algset.created_at * 1000).toLocaleString()}</td>
                <td><Button onClick={edit(algset)}>Edit</Button></td>
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
