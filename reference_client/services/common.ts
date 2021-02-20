import { format } from 'timeago.js'

type StringKeyObject = { [x: string]: any }

export function generateTimeAgoString(unixTimestamp: number | null) {
  if (!unixTimestamp) return 'None'

  return format(unixTimestamp * 1000)
}

export function capitalizeString(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

export async function copyToClipboard(that, content) {
  await navigator.clipboard.writeText(content)
  that.$notifier.showSnackbar({
    message: 'Copied to Clipboard',
    variant: 'success',
  })
}

export function getNestedProperty(obj: StringKeyObject, path: string) {
  const pathArray = path.split(/\./)
  let currentValue = obj
  for (const prop of pathArray) {
    // if not object, return null;
    if (!(currentValue && typeof currentValue === 'object')) {
      return null
    }
    currentValue = currentValue[prop]
  }
  return currentValue
}

export function isObject(ele: unknown): ele is StringKeyObject {
  return Object.prototype.toString.call(ele) === '[object Object]'
}

export function collapseObject(obj: StringKeyObject): StringKeyObject | null {
  const returnObject = {}
  const nestedFieldsSet: Set<string> = new Set()

  for (const field in obj) {
    if (field.match(/\./)) {
      const firstPart = field.substr(0, field.indexOf('.'))
      const secondPart = field.substr(field.indexOf('.') + 1)

      // if field is set as null, skip
      if (returnObject[firstPart] === null) continue

      // if field not in return object as object, set it
      if (!isObject(returnObject[firstPart])) {
        returnObject[firstPart] = {}
        nestedFieldsSet.add(firstPart)
      }

      // if secondPart is "id", set it to null
      if (secondPart === 'id' && obj[field] === null) {
        returnObject[firstPart] = null
        nestedFieldsSet.delete(firstPart)
        continue
      }

      returnObject[firstPart][secondPart] = obj[field]
      // leaf field, add to obj if not already set
    } else if (!(field in returnObject)) {
      returnObject[field] = obj[field]
    }
  }

  // process the fields that are nested
  nestedFieldsSet.forEach((field) => {
    returnObject[field] = collapseObject(returnObject[field])
  })
  return returnObject
}

export function collapseObjectArray(objArray: StringKeyObject[]) {
  return objArray.map((obj) => collapseObject(obj))
}
