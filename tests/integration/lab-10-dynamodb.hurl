# Test DynamoDB integration with fragments API

# 1. Create first fragment (JSON)
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1

{
  "service": "DynamoDB"
}

HTTP/1.1 201
[Asserts]
header "Location" exists
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
# This check is >= 27, as the JSON might ommit quotes or whitespaces
jsonpath "$.fragment.size" >= 27

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 2. Get first fragment metadata
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment1_id}}"
jsonpath "$.fragment.type" == "application/json"
# This check is >= 27, as the JSON might ommit quotes or whitespaces
jsonpath "$.fragment.size" >= 27

# 3. Create second fragment (Markdown)
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1

`DynamoDB is **great**.`

HTTP/1.1 201
[Asserts]
header "Location" exists

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 4. Get second fragment metadata
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragment.type" == "text/markdown"

# 5. List all fragments (just IDs)
GET http://localhost:8080/v1/fragments?expand=false
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" contains {{fragment1_id}}
jsonpath "$.fragments" contains {{fragment2_id}}

# 6. Delete first fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# 7. Verify first fragment is deleted
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# 8. List fragments again to verify deletion
GET http://localhost:8080/v1/fragments?expand=false
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" not contains {{fragment1_id}}
jsonpath "$.fragments" contains {{fragment2_id}}