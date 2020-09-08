import React, { ReactElement, useState, ChangeEvent, MouseEvent, FormEvent } from 'react'
import { Input, Select, Button } from '@chakra-ui/core'
import useJqlMutation from '../../../hooks/useJqlMutation'
import { Maybe, Algset, Puzzle } from '../../../generated/jql'

export type AlgsetMutationArgs = {
  id?: string
  name?: string
  puzzle?: string
  mask?: Maybe<string> | null
  visualization?: string
  is_public?: boolean,
}

type Props = {
  onAdd: () => void
  puzzles: Array<Maybe<Puzzle>>
}

export default function AddAlgset({ onAdd, puzzles }: Props): ReactElement {
  const [algsetName, setAlgsetName] = useState<string>('')
  const [selectedPuzzle, setSelectedPuzzle] = useState<string>('0')

  const [mutate, { isLoading }] = useJqlMutation<
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
      <td />
      <td />
      <td>
        <Button isLoading={isLoading} isDisabled={!algsetName} onClick={onClick}>Add</Button>
      </td>
    </tr>
  )
}