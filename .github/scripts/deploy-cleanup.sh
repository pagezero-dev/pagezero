#! /bin/bash

echo "Fetching GitHub deployment ID for branch: $PR_BRANCH"
RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/${{ github.repository }}/deployments")

# Extract the deployment ID related to the PR branch
GITHUB_DEPLOYMENT_ID=$(echo "$RESPONSE" | jq -r --arg branch "$PR_BRANCH" \
  '.[] | select(.ref == $branch) | .id' | head -n 1)

if [ -z "$GITHUB_DEPLOYMENT_ID" ]; then
  echo "No deployment found for this PR."
  exit 0
fi

echo "Found GitHub Deployment ID: $GITHUB_DEPLOYMENT_ID"
echo "github_deployment_id=$GITHUB_DEPLOYMENT_ID" >> $GITHUB_ENV


echo "Fetching Cloudflare deployment ID for branch: $PR_BRANCH"
RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$CLOUDFLARE_PROJECT_NAME/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

CLOUDFLARE_DEPLOYMENT_ID=$(echo "$RESPONSE" | jq -r --arg branch "$PR_BRANCH" \
  '.result[] | select(.deployment_trigger.metadata.branch == $branch) | .id' | head -n 1)

if [ -z "$CLOUDFLARE_DEPLOYMENT_ID" ]; then
  echo "No Cloudflare deployment found for this branch."
  exit 0
fi

echo "Found Cloudflare Deployment ID: $CLOUDFLARE_DEPLOYMENT_ID"
echo "cloudflare_deployment_id=$CLOUDFLARE_DEPLOYMENT_ID" >> $GITHUB_ENV


echo "Deleting Cloudflare Pages deployment: $CLOUDFLARE_DEPLOYMENT_ID"
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$CLOUDFLARE_PROJECT_NAME/deployments/$CLOUDFLARE_DEPLOYMENT_ID" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -o response.json

# Check if the deletion was successful
if grep -q '"success":true' response.json; then
  echo "✅ Successfully deleted Cloudflare deployment."
else
  echo "❌ Failed to delete Cloudflare deployment."
  cat response.json
  exit 1
fi

echo "Deleting GitHub deployment: $GITHUB_DEPLOYMENT_ID"
curl -X DELETE "https://api.github.com/repos/${{ github.repository }}/deployments/$GITHUB_DEPLOYMENT_ID" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -o response.json

# Check if the deletion was successful
if grep -q '"message":"Not Found"' response.json; then
  echo "❌ Failed to delete GitHub deployment. Deployment not found."
  cat response.json
  exit 1
elif grep -q '"message":"Bad credentials"' response.json; then
  echo "❌ Failed to delete GitHub deployment. Invalid credentials."
  cat response.json
  exit 1
else
  echo "✅ Successfully deleted GitHub deployment."
fi