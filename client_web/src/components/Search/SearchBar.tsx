import React, { ReactElement } from 'react'
import {
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  InputLeftAddon,
  Wrap,
  Text,
  Stack,
  Box,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from '@chakra-ui/react'
import { useCombobox, UseComboboxStateChange } from 'downshift'
import { useHistory, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import useSearch from '../../hooks/useSearch'
import AlgTag from '../Tags/AlgTag'
import useDebounce from '../../hooks/useDebounce'
import useFocusKeyPress from '../../hooks/useKeyPress'
import useJqlQuery from '../../hooks/useJqlQuery'
import PuzzleTag from '../Tags/PuzzleTag'

interface Props {}

function getLastTag(query: string) {
  const words = query.split(' ')
  const tag = words[query.length - 1]
  if (tag) return tag.substring(1)
  return ''
}

export default function SearchBar({}: Props): ReactElement {
  const location = useLocation()
  const highlightColor = useColorModeValue('gray.100', 'gray.600')
  const [focus, setFocus] = React.useState(false)
  const [items, setItems] = React.useState<any>([])
  const hashtagPress = useFocusKeyPress('#')
  const atPress = useFocusKeyPress('@')
  const spacePress = useFocusKeyPress(' ')
  const [currSearch, setCurrSearch] = React.useState<'tag' | 'user' | 'algset'>(
    'algset',
  )

  React.useEffect(() => {
    if (focus) {
      if (spacePress && currSearch !== 'algset') setCurrSearch('algset')
      else if (atPress && currSearch !== 'user') setCurrSearch('user')
      else if (hashtagPress && currSearch !== 'tag') setCurrSearch('tag')
    }
  }, [hashtagPress, atPress, spacePress, focus])
  const [
    query,
    setQuery,
    { signal: querySignal, debouncing: queryDebouncing },
  ] = useDebounce<string>({ defaultValue: '', delay: 1000 })
  const [tags, setTags] = React.useState<string[]>([])
  const [user, setUser] = React.useState<string>()

  const {
    data: dataAlgset,
    isLoading: isLoadingAlgset,
  } = useJqlQuery<'getAlgsetPaginator'>(
    ['searchAlgsetRes', query],
    {
      getAlgsetPaginator: {
        edges: {
          node: {
            id: true,
            // @ts-ignore
            puzzle: {
              name: true,
              code: true,
            },
            name: true,
          },
        },
        __args: {
          first: 10,
          filterBy: [
            {
              field: 'code',
              operator: 'regex',
              value: `^.*${query}.*`,
            },
          ],
        },
      },
    },
    {
      enabled: query !== '' && !queryDebouncing && currSearch === 'algset',
    },
  )
  const {
    data: dataTag,
    isLoading: isLoadingTag,
  } = useJqlQuery<'getTagPaginator'>(
    ['searchTagRes', getLastTag(query)],
    {
      getTagPaginator: {
        edges: {
          node: {
            name: true,
            id: true,
          },
        },
        __args: {
          first: 10,
          filterBy: [
            {
              field: 'id',
              operator: 'regex',
              value: `^.*${getLastTag(query)}.*`,
            },
          ],
        },
      },
    },
    {
      enabled: query !== '' && !queryDebouncing && currSearch === 'tag',
    },
  )
  const {
    data: dataUser,
    isLoading: isLoadingUser,
  } = useJqlQuery<'getUserPaginator'>(
    ['searchUserRes', getLastTag(query)],
    {
      getUserPaginator: {
        edges: {
          node: {
            name: true,
            avatar: true,
            wca_id: true,
            id: true,
          },
        },
        __args: {
          first: 10,
          filterBy: [
            {
              field: 'id',
              operator: 'regex',
              value: `^.*${getLastTag(query)}.*`,
            },
          ],
        },
      },
    },
    {
      enabled: query !== '' && !queryDebouncing && currSearch === 'user',
    },
  )

  React.useEffect(() => {
    console.log(dataTag)
    console.log(isLoadingTag)
    console.log(currSearch)
    if (dataAlgset && !isLoadingAlgset && currSearch === 'algset')
      setItems(dataAlgset.edges)
    else if (dataTag && !isLoadingTag && currSearch === 'tag')
      setItems(dataTag.edges)
    else if (dataUser && !isLoadingUser && currSearch === 'user')
      setItems(dataUser.edges)
  }, [
    dataAlgset,
    dataUser,
    dataTag,
    isLoadingAlgset,
    isLoadingTag,
    isLoadingUser,
    querySignal,
  ])

  const history = useHistory()
  const { search } = useSearch()
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    search(query, tags)
    const urlParams = new URLSearchParams({ q: query, t: tags.join('+') })
    history.push({
      pathname: '/search',
      search: urlParams.toString(),
    })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setCurrSearch('algset')
      setItems([])
    }
    const newVal = event.target.value
    const vals = newVal.split(' ')
    if (
      vals.length > 1 &&
      vals[vals.length - 1] === '' &&
      vals[vals.length - 2].charAt(0) === '#' &&
      vals[vals.length - 2].length > 1 &&
      !tags.includes(vals[vals.length - 2].slice(1))
    ) {
      setTags([...tags, vals[vals.length - 2].slice(1)])
      setQuery(vals.slice(0, vals.length - 2).join(' '))
    } else setQuery(newVal)
  }

  const itemToString = (item: any) => item?.node.name ?? ''

  function onSelectedItemChange(changes: UseComboboxStateChange<any>) {
    console.log(changes)
  }

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({ items, itemToString, onSelectedItemChange })

  return (
    <form onSubmit={handleSubmit}>
      <Box
        // @ts-ignore
        onSubmit={handleSubmit}
        w="100%"
        spacing="2em"
        px={{ sm: '10vw', md: '20vw' }}
        {...getComboboxProps()}
      >
        <InputGroup>
          {tags.length > 0 && (
            <InputLeftAddon h="3rem" borderRadius="15px">
              <Wrap>
                {tags.map((tag, index) => (
                  <AlgTag
                    label={tag}
                    key={tag}
                    closeButton
                    onClose={() => setTags([...tags.filter((t) => t !== tag)])}
                  />
                ))}
              </Wrap>
            </InputLeftAddon>
          )}
          <Input
            size="lg"
            placeholder="Search Alg Sets (use # to filter by tags, @ to filter by users)"
            borderRadius="15px"
            {...getInputProps({
              value: query,
              onChange: handleChange,
              onFocus: () => setFocus(true),
              onBlur: () => setFocus(false),
            })}
          />
          <InputRightElement>
            <>
              <Icon
                as={AiOutlineSearch}
                color={focus ? 'blue.500' : 'gray.800'}
                boxSize={6}
              />
              <button
                type="button"
                // eslint-ignore-line
                {...getToggleButtonProps()}
                aria-label="toggle menu"
              >
                &#8595;
              </button>
            </>
          </InputRightElement>
        </InputGroup>
        <Box pb={4} mb={4}>
          <List
            borderRadius="4px"
            border={isOpen && '1px solid rgba(0,0,0,0.1)'}
            boxShadow="6px 5px 8px rgba(0,50,30,0.02)"
            {...getMenuProps()}
          >
            {isOpen &&
              items.map((item: any, index: number) => (
                <ListItem
                  px={2}
                  py={1}
                  borderBottom="1px solid rgba(0,0,0,.01)"
                  bg={highlightedIndex === index ? highlightColor : 'inherit'}
                  key={`${item.node.name}`}
                  {...getItemProps({ item, index })}
                >
                  (
                  <Box display="inline-flex" alignItems="center">
                    <Text>{item.node.name}</Text>
                  </Box>
                  )
                </ListItem>
              ))}
          </List>
        </Box>
        {/* <Center mt="2em"></Center> */}
      </Box>
    </form>
  )
}
