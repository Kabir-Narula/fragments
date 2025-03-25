# Test posting JSON fragment
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"test": "value"}`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "application/json"
[Captures]
fragment_url: header "Location"

# Verify GET returns JSON
GET {{fragment_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" == "application/json; charset=utf-8"
jsonpath "$.test" == "value"