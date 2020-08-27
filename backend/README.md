# jql-boilerplate

Sample Requests:

**Get a user by ID**

`POST https://us-central1-jql-boilerplate.cloudfunctions.net/api/graphql`

```
{
	"action": "getUser",
	"query": {
		"id": null,
		"name": null,
		"reviews": {
			"data": {
				"id": null,
				"name": null,
				"created_by": {
          "id": null,
          "name": null,
        },
        "jsonFields": null
			}
		},
		"__args": {
			"id": 1
		}
	}
}
```

**Get reviews created by a user**

`POST https://us-central1-jql-boilerplate.cloudfunctions.net/api/graphql`

```
{
	"action": "getReviews",
	"query": {
		"data": {
			"id": null,
			"created_by": {
				"id": null,
				"name": null
			}
		},
		"__args": {
			"user_id": 2
		}
	}
}
```

**Get company by ID**

`POST https://us-central1-jql-boilerplate.cloudfunctions.net/api/graphql`

```
{
	"action": "getCompany",
	"query": {
		"id": null,
		"created_by": null,
		"__args": {
			"id": 2
		}
	}
}
```
