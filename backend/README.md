# algdb backend

The schema of the backend can be found [here](https://github.com/cubing/algdb/blob/main/schema.graphql)

Example Requests:

- **(AUTH)** = Authorization required in the header of each request
- **(ADMIN)** = Authenticated user must have ADMIN role

**Login Using WCA Code**

`POST https://api.algdb.net/jomql`

```
{
	"action": "socialLogin",
	"query": {
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
	"action": "getCurrentUser",
	"query": {
		"id": true,
		"wca_id": true,
		"email": true,
		"avatar": true,
		"country": true,
		"is_public": true,
		"role": {
			"id": true,
			"name": true
		}
	}
}
```

**Update User by ID (ADMIN) (AUTH)**

`POST https://api.algdb.net/jomql`

```
{
	"action": "updateUser",
	"query": {
		"id": true,
		"wca_id": true,
		"email": true,
		"avatar": true,
		"country": true,
		"is_public": true,
		"role": {
			"id": true,
			"name": true
		},
		"__args": {
			"id": 1,
			"name": "John Doe",
			"role": "MODERATOR"
		}
	}
}
```

**Add Puzzle (ADMIN) (AUTH)**

`POST https://api.algdb.net/jomql`

```
{
	"action": "createPuzzle",
	"query": {
		"id": true,
		"name": true,
		"__args": {
			"id": 1,
			"name": "3x3x3"
		}
	}
}
```

**List All Puzzles (showing totals/counts)**

`POST https://api.algdb.net/jomql`

```
{
	"action": "getMultiplePuzzle",
	"query": {
		"paginatorInfo": {
			"count": true,
			"total": true
		},
		"data": {
			"id": true,
			"name": true,
			"created_at": true
		}
	}
}
```
