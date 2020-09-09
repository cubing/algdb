# algdb backend

The schema of the backend can be found [here](https://github.com/cubing/algdb/blob/main/schema.graphql)

Example Requests:

- **(AUTH)** = Authorization required in the header of each request
- **(ADMIN)** = Authenticated user must have ADMIN role

**Login Using WCA Code**

`POST https://api.algdb.net/jql`

```
{
	"action": "socialLogin",
	"query": {
		"token": null,
		"type": null,
		"__args": {
			"provider": "wca",
			"code": "<CODE FROM WCA RESPONSE HERE>"
		}
	}
}
```

**Get Current User Info (AUTH)**

`POST https://api.algdb.net/jql`

```
{
	"action": "getCurrentUser",
	"query": {
		"id": null,
		"wca_id": null,
		"email": null,
		"avatar": null,
		"country": null,
		"is_public": null,
		"role": {
			"id": null,
			"name": null
		}
	}
}
```

**Update User by ID (ADMIN) (AUTH)**

`POST https://api.algdb.net/jql`

```
{
	"action": "updateUser",
	"query": {
		"id": null,
		"wca_id": null,
		"email": null,
		"avatar": null,
		"country": null,
		"is_public": null,
		"role": {
			"id": null,
			"name": null
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

`POST https://api.algdb.net/jql`

```
{
	"action": "createPuzzle",
	"query": {
		"id": null,
		"name": null,
		"__args": {
			"id": 1,
			"name": "3x3x3"
		}
	}
}
```

**List All Puzzles (showing totals/counts)**

`POST https://api.algdb.net/jql`

```
{
	"action": "getMultiplePuzzle",
	"query": {
		"paginatorInfo": {
			"count": null,
			"total": null
		},
		"data": {
			"id": null,
			"name": null,
			"created_at": null
		}
	}
}
```
