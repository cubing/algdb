# algdb backend

The schema of the backend can be found [here](https://github.com/cubing/algdb/blob/main/backend/functions/schema.ts)

Example Requests:

- **(AUTH)** = Authorization required in the header of each request
- **(ADMIN)** = Authenticated user must have ADMIN role

**Login Using WCA Code**

`POST https://api.algdb.net/jomql`

```
{
	"socialLogin": {
		"token": true,
		"type": true,
		"__args": {
			"provider": "wca",
			"code": "<CODE FROM WCA RESPONSE HERE>",
			"redirect_uri": "http://localhost:3000/wca-redirect"
		}
	}
}
```

**Get Current User Info (AUTH)**

`POST https://api.algdb.net/jomql`

```
{
	"getCurrentUser": {
		"id": true,
		"wca_id": true,
		"email": true,
		"avatar": true,
		"country": true,
		"is_public": true,
		"role": true
	}
}
```

**Update User by ID (ADMIN) (AUTH)**

`POST https://api.algdb.net/jomql`

```
{
	"updateUser": {
		"id": true,
		"wca_id": true,
		"email": true,
		"avatar": true,
		"country": true,
		"is_public": true,
		"role": true,
		"__args": {
			"id": 1,
			"name": "John Doe",
			"role": "NORMAL"
		}
	}
}
```

**Add Puzzle (ADMIN) (AUTH)**

`POST https://api.algdb.net/jomql`

```
{
	"createPuzzle": {
		"id": true,
		"name": true,
		"__args": {
			"id": 1,
			"name": "3x3x3",
			"code": "333"
		}
	}
}
```

**List All Puzzles (showing totals/counts)**

`POST https://api.algdb.net/jomql`

```
{
	"getPuzzlePaginator": {
		"paginatorInfo": {
			"count": true,
			"total": true,
			"startCursor": true,
			"endCursor": true
		},
		"edges": {
			"node": {
				"id": true,
				"name": true,
				"created_at": true
			},
			"cursor": true
		}
	}
}
```

# Setting up with TypeScript IntelliSense

**Example TypeScript Implementation with jomql**

```
import { Root, GetQuery, GetResponse } from "../types";

async function executeJomql<Key extends keyof Root>(query: GetQuery<Key>): Promise<GetResponse<Key>> {

  const { data } = await callJomqlEndpoint(query);

  return data.data;
}

const queryResult = await executeJomql<"getCurrentUser">({
	"getCurrentUser": {
		"id": true,
		"wca_id": true,
		"email": true,
		"avatar": true,
		"country": true,
		"is_public": true,
		"role": true
	}
});

console.log(queryResult.role)
```
