#!/bin/bash -x

curl -v -X POST -H "Content-Type: application/json" -d @manual-mocks/hessian.mock http://localhost:9001/specs

curl -v -X GET http://localhost:9001/specs

curl -v -X POST --data-binary "@manual-mocks/request-binary.bin" -H "Content-Type: x-application/hessian" http://localhost:9001/media/test
